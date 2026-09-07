import { Database, ExternalLink, Lock, PlugZap, RefreshCw } from 'lucide-react'
import { PageHeader } from '../_components'
import { getActiveProviders } from '@/lib/integrations/registry'

const PROVIDER_LABELS: Record<string, string> = {
  postgres: 'Local (PostgreSQL)',
  manual: 'Manual (aprobación)',
  saas: 'Camaleón (SaaS)',
  erp: 'Camaleón (SaaS)',
  merchant: 'Camaleón (SaaS)',
}

const PROVIDER_DESCRIPTIONS: Record<string, string> = {
  catalog:
    'Catálogo de libros: fichas, portadas, precios y stock que ve la tienda',
  inventory: 'Stock por sucursal y movimientos de inventario',
  orders: 'Almacenamiento de pedidos y confirmaciones',
  payment: 'Pasarela de cobro al finalizar la compra',
}

function mask(value: string | undefined): string | null {
  if (!value) return null
  if (value.length <= 8) return '••••••••'
  return `${value.slice(0, 4)}••••••${value.slice(-4)}`
}

const ENV_VARS = [
  { key: 'CATALOG_API_URL', type: 'url' as const, help: 'Módulo Catálogo de Camaleón (precios en ARS)' },
  { key: 'CATALOG_API_TOKEN', type: 'token' as const, help: 'JWT de negocio (Authorization: Bearer)' },
  { key: 'CATALOG_API_TENANT_SLUG', type: 'value' as const, help: 'Slug multi-tenant (header X-Tenant-Slug)' },
  { key: 'ERP_API_URL', type: 'url' as const, help: 'Módulo de logística / pedidos / stock' },
  { key: 'ERP_API_TOKEN', type: 'token' as const, help: 'JWT de negocio para el módulo ERP' },
  { key: 'MERCHANT_API_URL', type: 'url' as const, help: 'Módulo de cobros / pagos' },
  { key: 'MERCHANT_API_TOKEN', type: 'token' as const, help: 'JWT de negocio para el módulo de pagos' },
]

export default async function AdminSaasPage() {
  const providers = getActiveProviders()

  const rows = [
    { key: 'catalog', provider: providers.catalog.provider },
    { key: 'inventory', provider: providers.inventory.provider },
    { key: 'orders', provider: providers.orders.provider },
    { key: 'payment', provider: providers.payment.provider },
  ]

  const configured = ENV_VARS.filter((v) => process.env[v.key])
  const pending = ENV_VARS.filter((v) => !process.env[v.key])

  return (
    <div>
      <PageHeader
        title="Conectar Camaleón (SaaS)"
        description="Integración con la plataforma de gestión de tu negocio"
      />

      <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
        <p className="flex items-start gap-2">
          <PlugZap className="mt-0.5 w-4 h-4 shrink-0" />
          <span>
            Este apartado prepara la conexión con <strong>Camaleón</strong>, el SaaS donde
            vas a gestionar catálogo, stock y pedidos. La tienda ya sabe hablar con él por
            API: cuando se configuren las credenciales y se active el modo externo, todo
            el panel queda operativo sin tocar código.
          </span>
        </p>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-900">Servicios de la tienda</h2>
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => {
          const external = row.provider !== 'postgres' && row.provider !== 'manual'
          return (
            <div key={row.key} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500 capitalize">{row.key}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    external ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {external ? <ExternalLink className="w-3 h-3" /> : <Database className="w-3 h-3" />}
                  {external ? 'Externo' : 'Local'}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {PROVIDER_LABELS[row.provider] ?? row.provider}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {PROVIDER_DESCRIPTIONS[row.key]}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Credenciales de conexión</h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400">
            <Lock className="w-3 h-3" /> Definidas por variables de entorno
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Variable</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3 hidden md:table-cell">Uso</th>
              </tr>
            </thead>
            <tbody>
              {ENV_VARS.map((v) => {
                const value = process.env[v.key]
                const display =
                  v.type === 'token'
                    ? mask(value)
                    : value
                return (
                  <tr key={v.key} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{v.key}</td>
                    <td className="px-4 py-3">
                      {value ? (
                        <span className="font-mono text-xs text-emerald-700">{display}</span>
                      ) : (
                        <span className="text-xs text-slate-400">Sin configurar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">{v.help}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">Cómo activarlo</h3>
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
            <li>Completá los valores en el archivo <code className="font-mono text-xs">.env</code> del servidor.</li>
            <li>Reiniciá la aplicación una sola vez.</li>
            <li>
              Activá los proveedores: <code className="font-mono text-xs">CATALOG_PROVIDER=saas</code>,{' '}
              <code className="font-mono text-xs">INVENTORY_PROVIDER=erp</code>,{' '}
              <code className="font-mono text-xs">PAYMENT_PROVIDER=merchant</code>.
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">Estado actual</h3>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-slate-600">
              Credenciales configuradas: <strong>{configured.length}</strong> de {ENV_VARS.length}.
            </p>
            {configured.length === 0 ? (
              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <PlugZap className="w-3 h-3" />
                Todavía no se definieron variables externas. La tienda sigue funcionando 100%
                con la base de datos local.
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Hay {pending.length} variable(s) pendiente(s) para completar la conexión.
              </p>
            )}
            <p className="text-xs text-slate-500">
              El contrato de endpoints esperado está documentado en <code className="font-mono">docs/saas-catalog-rest.md</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}