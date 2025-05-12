import { AlertsDashboard } from "@/components/dashboard/alerts-dashboard"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Search } from "@/components/dashboard/search"

export default function AlertsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="hidden md:flex">
            <MainNav />
          </div>
          <MobileNav />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Alertes</h2>
        </div>
        <AlertsDashboard />
      </div>
    </div>
  )
}
