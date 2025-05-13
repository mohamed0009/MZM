import { Component, type OnInit } from "@angular/core"
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms"
import type { Router, ActivatedRoute } from "@angular/router"
import type { AuthService } from "../../shared/services/auth.service"
import type { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoading = false
  error = ""
  returnUrl: string

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    // Rediriger vers la page d'accueil si déjà connecté
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"])
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    })

    // Récupérer l'URL de retour des paramètres de requête ou utiliser la page d'accueil
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/"
  }

  onSubmit(): void {
    // Arrêter ici si le formulaire est invalide
    if (this.loginForm.invalid) {
      return
    }

    this.isLoading = true
    this.error = ""

    this.authService.login(this.loginForm.controls["email"].value, this.loginForm.controls["password"].value).subscribe(
      () => {
        this.router.navigate([this.returnUrl])
      },
      (error) => {
        this.error = error.message || "Email ou mot de passe incorrect"
        this.isLoading = false
      },
    )
  }
}
