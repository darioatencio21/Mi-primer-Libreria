import type { Metadata } from "next"
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants"
import { PromoBar, Header, Footer } from "@/components/layout"
import { CartProvider } from "@/components/cart/CartProvider"

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
}

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartProvider />
    </div>
  )
}
