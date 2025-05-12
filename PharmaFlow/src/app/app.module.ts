import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { RouterModule } from "@angular/router"

import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatListModule } from "@angular/material/list"
import { MatMenuModule } from "@angular/material/menu"
import { MatNativeDateModule } from "@angular/material/core"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"
import { MatTabsModule } from "@angular/material/tabs"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatBadgeModule } from "@angular/material/badge"
import { MatChipsModule } from "@angular/material/chips"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { LoginComponent } from "./auth/login/login.component"
import { SignupComponent } from "./auth/signup/login.component"
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component"
import { DashboardComponent } from "./dashboard/dashboard.component"
import { InventoryComponent } from "./inventory/inventory.component"
import { ClientsComponent } from "./clients/clients.component"
import { CalendarComponent } from "./calendar/calendar.component"
import { AlertsComponent } from "./alerts/alerts.component"
import { ProfileComponent } from "./profile/profile.component"
import { SettingsComponent } from "./settings/settings.component"
import { UsersManagementComponent } from "./admin/users-management/users-management.component"
import { HeaderComponent } from "./shared/components/header/header.component"
import { SidenavComponent } from "./shared/components/sidenav/sidenav.component"
import { QuickAccessComponent } from "./shared/components/quick-access/quick-access.component"
import { DashboardCardsComponent } from "./shared/components/dashboard-cards/dashboard-cards.component"
import { MedicationsListComponent } from "./shared/components/medications-list/medications-list.component"
import { ClientsListComponent } from "./shared/components/clients-list/clients-list.component"
import { AlertsPanelComponent } from "./shared/components/alerts-panel/alerts-panel.component"
import { CalendarViewComponent } from "./shared/components/calendar-view/calendar-view.component"
import { ConfirmDialogComponent } from "./shared/components/confirm-dialog/confirm-dialog.component"

import { AuthService } from "./shared/services/auth.service"
import { MedicationService } from "./shared/services/medication.service"
import { ClientService } from "./shared/services/client.service"
import { AlertService } from "./shared/services/alert.service"
import { UserService } from "./shared/services/user.service"
import { NotificationService } from "./shared/services/notification.service"
import { AuthGuard } from "./shared/guards/auth.guard"
import { AdminGuard } from "./shared/guards/admin.guard"

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    DashboardComponent,
    InventoryComponent,
    ClientsComponent,
    CalendarComponent,
    AlertsComponent,
    ProfileComponent,
    SettingsComponent,
    UsersManagementComponent,
    HeaderComponent,
    SidenavComponent,
    QuickAccessComponent,
    DashboardCardsComponent,
    MedicationsListComponent,
    ClientsListComponent,
    AlertsPanelComponent,
    CalendarViewComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
    MatChipsModule,
  ],
  providers: [
    AuthService,
    MedicationService,
    ClientService,
    AlertService,
    UserService,
    NotificationService,
    AuthGuard,
    AdminGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
