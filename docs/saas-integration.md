# Conexión a un SaaS externo (pasarelas de pago + ERP/inventario/logística)

Este proyecto está preparado para conectarse en el futuro a un SaaS **externo
desarrollado por ustedes mismos**, cubriendo tres necesidades:

- **Catálogo de libros** (libros, precios, imágenes, stock) vía GraphQL.
- **Pasarela de pagos** (cobro real de los pedidos).
- **ERP / inventario / logística** (gestión de stock y centralización de pedidos).

Toda la lógica de negocio (cobro, stock, creación de pedidos) se escribe contra
**puertos (interfaces)** y los proveedores concretos se resuelven como
**adaptadores** seleccionables por variables de entorno. Así, activar el SaaS
externo **no requiere reescribir el checkout**: solo hay que apuntar la config.

---

## Cómo está organizado

```
src/lib/integrations/
  ports.ts                          Contratos (interfaces) del negocio
  types.ts                          Tipos compartidos de integración
  registry.ts                       Factory: elige adaptador según .env
  index.ts                          Barrel público
  actions/place-order.ts            Server action que orquesta cobro→stock→pedido
  http.ts                           Cliente HTTP tipado para llamar al SaaS
  payments/
    manual.ts                       Cobro simulado (por defecto, gratis)
    merchant.ts                     Cobro vía pasarela externa (MERCHANT_API_URL)
  inventory/
    postgres.ts                     Stock local en Postgres (por defecto)
    erp.ts                          Stock delegado al ERP externo (ERP_API_URL)
  orders/
    postgres.ts                     Pedidos locales en Postgres (por defecto)
    erp.ts                          Pedidos delegados al ERP externo (ERP_API_URL)
  catalog/
    ports.ts                        Puerto de catálogo (interfaz)
    postgres.ts                     Catálogo local en Postgres (por defecto)
    saas.ts                         Catálogo vía GraphQL del SaaS (CATALOG_API_URL)
    queries.ts                      Queries GraphQL del catálogo
    mappers.ts                      Mapeo formato SaaS -> dominio (Book, Author...)
    graphql.ts                      Cliente GraphQL mínimo
```

### Los cuatro puertos (`ports.ts`)

| Puerto | Responsabilidad | Adaptadores |
|---|---|---|
| `CatalogProvider.*` | Leer libros/categorías/autores/reseñas | `postgres`, `saas` |
| `PaymentProvider.charge` | Cobrar el pedido | `manual`, `merchant` |
| `InventoryProvider.reserve/release` | Reservar/liberar stock | `postgres`, `erp` |
| `OrderStore.createOrder` | Persistir el pedido | `postgres`, `erp` |

El resto de la aplicación **nunca** instancia estos adaptadores directamente:
usa `placeOrder()` (o las fábricas de `registry.ts`).

---

## Configuración por variables de entorno

Copia/variables en `.env` (ver `.env.example`):

```ini
# Proveedores activos
CATALOG_PROVIDER=postgres        # postgres | saas
ORDERS_PROVIDER=postgres         # postgres | erp
INVENTORY_PROVIDER=postgres      # postgres | erp
PAYMENT_PROVIDER=manual          # manual   | merchant

# Solo si el proveedor correspondiente es 'saas', 'erp' o 'merchant'
CATALOG_API_URL=https://mi-saas.example.com/graphql
CATALOG_API_TOKEN=tu-token
ERP_API_URL=https://mi-saas.example.com
ERP_API_TOKEN=tu-token
MERCHANT_API_URL=https://mi-pasarela.example.com
MERCHANT_API_TOKEN=tu-token
```

**Comportamiento por defecto (ya configurado):** catálogo, pedidos y stock en
Postgres (Docker, `DATABASE_URL`), pago simulado. Todo funciona de punta a punta
sin el SaaS.

---

## Cómo activar el SaaS cuando estén listos

1. El backend externo expone los contratos detallados abajo
   (ver también `docs/saas-catalog-graphql.md` para el catálogo).
2. En `.env` pon los valores reales, por ejemplo:
   ```ini
   CATALOG_PROVIDER=saas
   ORDERS_PROVIDER=erp
   INVENTORY_PROVIDER=erp
   PAYMENT_PROVIDER=merchant
   CATALOG_API_URL=https://mi-empresa-saas.com/graphql
   ERP_API_URL=https://mi-empresa-saas.com
   MERCHANT_API_URL=https://mi-pasarela-saas.com
   ```
3. Reiniciar el servidor. La tienda y el flujo `placeOrder(..)` pasarán a hablar
   con el SaaS sin tocar el código de las páginas ni del checkout.

---

## Contratos HTTP esperados del SaaS externo

### Catálogo (`saas`)

GraphQL. Ver el contrato completo en **`docs/saas-catalog-graphql.md`**.
Requiere `CATALOG_API_URL` (endpoint GraphQL) y opcional `CATALOG_API_TOKEN`.

### Pasarela de pagos (`merchant`)

```
POST {MERCHANT_API_URL}/api/v1/payments
Authorization: Bearer {MERCHANT_API_TOKEN}   (si está definido)

body:
{
  amount: number,            // total en ARS
  currency: 'ARS' | 'USD',
  method: 'card' | 'paypal' | 'transfer',
  orderNumber: string,
  email?: string,
  customer?: Record<string, unknown>   // datos crudos de la tarjeta
}

resp 200:
{ status: 'approved' | 'pending' | 'rejected',
  transactionId: string,
  message?: string }
```

### ERP: inventario (`erp`)

```
POST {ERP_API_URL}/api/v1/inventory/reserve
body: { lines: [{ bookId: string, quantity: number }] }
resp: { success: boolean, reservationRef?: string,
        lines: [{ bookId, available, requested, remaining }],
        errors?: string[] }

POST {ERP_API_URL}/api/v1/inventory/release
body: { reservationRef: string }
```

### ERP: pedidos (`erp`)

```
POST {ERP_API_URL}/api/v1/orders
body:
{
  userId, email?,
  lines: [{ bookId, title, format, quantity, price }],
  subtotal, shipping, tax, total,
  shippingAddress: { fullName, street, city, postalCode, country, phone },
  shippingMethodId?
}
resp: { orderId: string, orderNumber: string, references?: Record<string,string> }
```

---

## Orden de orquestación (a prueba de fallos)

`actions/place-order.ts` ejecuta siempre en este orden seguro:

1. **Cobrar** (`PaymentProvider.charge`) — si no se aprueba, aborta.
2. **Reservar stock** (`InventoryProvider.reserve`) — si falta stock, libera lo
   reservado y aborta con el detalle de faltantes.
3. **Crear pedido** (`OrderStore.createOrder`) — si falla, revierte la reserva
   de inventario y aborta.

De esta forma nunca se cobra sin stock reservado ni se queda stock tomado sin
pedido creado.

---

## Notas

- El pago `manual` es un **simulador**: no cobra y aprueba siempre (replica el
  comportamiento actual del checkout). No usarlo en producción para cobrar de
  verdad.
- Los adaptadores locales (`postgres`) escriben directo con Drizzle/pg del lado
  del servidor; no hay RLS (la app usa un único rol de aplicación).
- Los adaptadores del catálogo `saas`/`postgres` **no reescriben el código de las
  páginas**: la tienda sigue llamando a las mismas funciones del dominio
  (`getBookBySlug`, `getBestsellers`, etc.). Hoy esas funciones apuntan a
  `@/lib/data`; cuando actives `CATALOG_PROVIDER=saas`, se sirven desde el SaaS
  (ver `docs/saas-catalog-graphql.md`).
- Si el checkout aún hoy no está conectado a `placeOrder` (solo limpia el carrito
  en el cliente), ese es el siguiente paso de integración: llamar a `placeOrder`
  desde el handle de pago con los datos capturados.