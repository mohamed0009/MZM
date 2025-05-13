import { Component, type OnInit } from "@angular/core"
import type { Router } from "@angular/router"
import type { AuthService, User } from "../../services/auth.service"
import type { NotificationService } from "../../services/notification.service"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null
  isLoggingOut = false
  notificationCount = 5

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user
    })
  }

  logout(): void {
    this.isLoggingOut = true
    this.authService.logout().subscribe(() => {
      this.isLoggingOut = false
      window.location.href = "/login" // Force page reload
    })
  }

  isAdmin(): boolean {
    return this.authService.isAdmin()
  }

  getRoleName(role: string | undefined): string {
    if (!role) return ""

    switch (role) {
      case "admin":
        return "Administrateur"
      case "manager":
        return "Gestionnaire"
      case "pharmacist":
        return "Pharmacien"
      case "assistant":
        return "Assistant"
      default:
        return role
    }
  }
}
