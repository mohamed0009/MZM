"use client"

import { usePathname } from "next/navigation"
import { GlobalHeader } from "@/components/global-header"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Routes where the header should be hidden
  const noHeaderRoutes = ['/', '/features', '/about', '/contact', '/tarifs', '/temoignages', '/faq', '/mentions-legales', '/carrieres']
  const isAuthPage = pathname?.startsWith("/auth/")
  const shouldShowHeader = !noHeaderRoutes.includes(pathname || '') && !isAuthPage

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowHeader && <GlobalHeader />}
      <main className={`flex-1 ${shouldShowHeader ? 'container py-6' : ''}`}>
        {children}
      </main>
    </div>
  )
} 