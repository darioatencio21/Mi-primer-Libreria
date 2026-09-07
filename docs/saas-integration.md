# Conexión a Camaleón (SaaS: POS/catálogo + inventario/logística)

Este proyecto está preparado para conectarse a **Camaleón SaaS** — plataforma
multi-tenant de punto de venta (POS) y gestión, enfocada al mercado argentino
(facturación ARCA, stock por sucursal, pedidos). Camaleón es una API **REST/JSON**
(Express + MariaDB vía Prisma), con **precios en pesos argentinos (ARS)** y
multi-tenant por `businessId` (JWT) + header `X-Tenant-Slug`.

Camaleón cubre dos de las necesidades:

- **Catálogo de libros** (libros, precios en ARS, imágenes, stock) vía **REST**
  (ver `docs/saas-catalog-rest.md` para el contrato exacto).
- **ERP / inventario** (gestión de stock por sucursal y pedidos).

El checkout/tienda sigue usando la lógica local (pedidos en Postgres de la tienda)
hasta que se active cada provider por variable de entorno.

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
    manual.ts                       Cobro simulado (por defecto, gratis/aprueba)
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
    rest.ts                         Catálogo vía REST de Camaleón (CATALOG_API_URL)
    mappers.ts                      Mapeo formato Camaleón -> dominio (Book, Author...)
```

La tienda **no depende de Postgres ni de Camaleón directamente**: las páginas
llaman a las funciones de `@/lib/data` (fachada) que delegan en el
`CatalogProvider` activo del registry.

---

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
CATALOG_API_URL=https://camaleon.example.com/api   # base REST (catálogo ARS)
CATALOG_API_TOKEN=tu-token                          # Bearer (JWT de negocio)
CATALOG_API_TENANT_SLUG=mi-negocio                  # header X-Tenant-Slug
ERP_API_URL=https://camaleon.example.com/api
ERP_API_TOKEN=tu-token
MERCHANT_API_URL=https://mi-pasarela.example.com
MERCHANT_API_TOKEN=tu-token
```

**Comportamiento por defecto (ya configurado):** catálogo, pedidos y stock en
Postgres (Docker, `DATABASE_URL`), pago simulado. Todo funciona de punta a punta
sin Camaleón.

---

## Cómo activar Camaleón cuando esté listo

1. Camaleón expone los contratos detallados abajo
   (ver `docs/saas-catalog-rest.md` para el catálogo).
2. En `.env` pon los valores reales, por ejemplo:
   ```ini
   CATALOG_PROVIDER=saas
   ORDERS_PROVIDER=postgres        # pedidos quedan locales por ahora
   INVENTORY_PROVIDER=erp         # stock se lee/reserva en Camaleón
   CATALOG_API_URL=https://camaleon.example.com/api
   CATALOG_API_TOKEN=<jwt-del-negocio>
   CATALOG_API_TENANT_SLUG=librostuc
   ERP_API_URL=https://camaleon.example.com/api
   ERP_API_TOKEN=<jwt-del-negocio>
   ```
3. Reiniciar el servidor. La tienda y el flujo `placeOrder(..)` pasarán a hablar
   con Camaleón sin tocar el código de las páginas ni del checkout.

---

## Contratos HTTP esperados del SaaS externo

### Catálogo (`saas`)

REST/JSON. Ver el contrato completo en **`docs/saas-catalog-rest.md`**.
Requiere `CATALOG_API_URL` (base REST) y opcional `CATALOG_API_TOKEN` +
`CATALOG_API_TENANT_SLUG`.

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

> Camaleón maneja stock por sucursal (`branch-stock`). El adaptador `erp` se
> alinea con `productIdBySku`/`applyBranchStockDelta`: el `bookId` de Camaleón
> corresponde al producto/SKU en la sucursal configurada por el token/tenant.

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
- La tienda llama a la **fachada** `@/lib/data`, que delega en el proveedor de
  catálogo activo. Por defecto (`postgres`) el comportamiento es idéntico al
  histórico; con `CATALOG_PROVIDER=saas` se sirve desde Camaleón sin cambiar las
  páginas (ver `docs/saas-catalog-rest.md`).
- El checkout ya está conectado a `placeOrder` vía `submitCheckout`
  (`src/app/(tienda)/checkout/actions.ts`): resuelve el `userId` (sesión o
  invitado auto-creado por email), valida/sanea insumos y orquesta cobro→stock→pedido.