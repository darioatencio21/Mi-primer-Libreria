import { redirect } from 'next/navigation'
import { isAdminSessionActive } from '@/lib/admin/auth'
import { AdminShell } from './_admin-shell'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const active = await isAdminSessionActive()
  if (!active) {
    redirect('/admin/login')
  }

  return <AdminShell>{children}</AdminShell>
}