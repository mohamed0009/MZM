"use client"

import { usePathname } from "next/navigation"
import { GlobalHeader } from "@/components/global-header"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isAuthPage = pathname?.startsWith("/auth/")
  const shouldShowHeader = !isHomePage && !isAuthPage

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowHeader && <GlobalHeader />}
      <main className={`flex-1 ${shouldShowHeader ? 'container py-6' : ''}`}>
        {children}
      </main>
    </div>
  )
} 