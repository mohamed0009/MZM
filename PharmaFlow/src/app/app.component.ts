import { Component } from "@angular/core"
import { type Router, NavigationEnd } from "@angular/router"
import { filter } from "rxjs/operators"
import type { AuthService } from "./shared/services/auth.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "PharmaSys"
  isAuthPage = false

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.isAuthPage =
        event.url.includes("/login") || event.url.includes("/signup") || event.url.includes("/reset-password")
    })
  }
}
