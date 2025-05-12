import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"

import { LoginComponent } from "./auth/login/login.component"
import { SignupComponent } from "./auth/signup/signup.component"
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { InventoryComponent } from "./inventory/inventory.component"
import { ClientsComponent } from "./clients/clients.component"
import { CalendarComponent } from "./calendar/calendar.component"
import { AlertsComponent } from "./alerts/alerts.component"
import { ProfileComponent } from "./profile/profile.component"
import { SettingsComponent } from "./settings/settings.component"
import { UsersManagementComponent } from "./admin/users-management/users-management.component"

import { AuthGuard } from "./shared/guards/auth.guard"
import { AdminGuard } from "./shared/guards/admin.guard"

const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "inventory", component: InventoryComponent, canActivate: [AuthGuard] },
  { path: "clients", component: ClientsComponent, canActivate: [AuthGuard] },
  { path: "calendar", component: CalendarComponent, canActivate: [AuthGuard] },
  { path: "alerts", component: AlertsComponent, canActivate: [AuthGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
  { path: "admin/users", component: UsersManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: "**", redirectTo: "/dashboard" },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
