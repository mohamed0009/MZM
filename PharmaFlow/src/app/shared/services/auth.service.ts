import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, of } from "rxjs"
import { delay, tap } from "rxjs/operators"
import type { Router } from "@angular/router"

export interface User {
  id?: number
  email: string
  name: string
  pharmacyName?: string
  role?: "admin" | "manager" | "pharmacist" | "assistant"
  isEmailVerified?: boolean
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>
  public currentUser: Observable<User | null>
  private isAuthenticatedSubject: BehaviorSubject<boolean>
  public isAuthenticated: Observable<boolean>
  private isLoadingSubject: BehaviorSubject<boolean>
  public isLoading: Observable<boolean>

  // Utilisateur par défaut pour permettre l'accès sans authentification
  private defaultUser: User = {
    id: 1,
    email: "admin@mzm.ma",
    name: "Administrateur MZM",
    role: "admin",
    isEmailVerified: true,
  }

  constructor(private router: Router) {
    // Initialiser avec l'utilisateur par défaut pour permettre l'accès sans authentification
    this.currentUserSubject = new BehaviorSubject<User | null>(this.defaultUser)
    this.currentUser = this.currentUserSubject.asObservable()
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(true)
    this.isAuthenticated = this.isAuthenticatedSubject.asObservable()
    this.isLoadingSubject = new BehaviorSubject<boolean>(false)
    this.isLoading = this.isLoadingSubject.asObservable()

    // Charger l'état d'authentification depuis localStorage au chargement
    this.loadAuthState()
  }

  private loadAuthState(): void {
    try {
      const storedAuth = localStorage.getItem("mzm-auth")
      if (storedAuth) {
        const authData = JSON.parse(storedAuth)
        if (authData.isAuthenticated && authData.user) {
          this.currentUserSubject.next(authData.user)
          this.isAuthenticatedSubject.next(true)
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'état d'authentification:", error)
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value
  }

  login(email: string, password: string): Observable<User> {
    this.isLoadingSubject.next(true)

    // Simulation d'une requête d'authentification
    return of(null).pipe(
      delay(1000),
      tap(() => {
        let userData: User | null = null

        if (email === "admin@mzm.ma" && password === "password") {
          userData = {
            id: 1,
            email,
            name: "Administrateur MZM",
            role: "admin",
            isEmailVerified: true,
          }
        } else if (email === "pharmacien@mzm.ma" && password === "password") {
          userData = {
            id: 2,
            email,
            name: "Pharmacien MZM",
            role: "pharmacist",
            isEmailVerified: true,
          }
        } else {
          throw new Error("Email ou mot de passe incorrect")
        }

        this.currentUserSubject.next(userData)
        this.isAuthenticatedSubject.next(true)
        localStorage.setItem(
          "mzm-auth",
          JSON.stringify({
            isAuthenticated: true,
            user: userData,
          }),
        )
        this.isLoadingSubject.next(false)
        return userData
      }),
    ) as Observable<User>
  }

  signup(userData: any): Observable<User> {
    this.isLoadingSubject.next(true)

    // Simulation d'une requête d'inscription
    return of(null).pipe(
      delay(1000),
      tap(() => {
        const user: User = {
          id: Math.floor(Math.random() * 1000),
          email: userData.email,
          name: userData.name,
          pharmacyName: userData.pharmacyName,
          role: "pharmacist",
          isEmailVerified: false,
        }

        this.currentUserSubject.next(user)
        this.isAuthenticatedSubject.next(true)
        localStorage.setItem(
          "mzm-auth",
          JSON.stringify({
            isAuthenticated: true,
            user,
          }),
        )
        this.isLoadingSubject.next(false)
        return user
      }),
    ) as Observable<User>
  }

  logout(): Observable<boolean> {
    // Réinitialiser l'état d'authentification
    this.currentUserSubject.next(null)
    this.isAuthenticatedSubject.next(false)

    // Supprimer les données d'authentification du localStorage
    localStorage.removeItem("mzm-auth")

    return of(true)
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === "admin"
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUserValue || !this.currentUserValue.role) return false

    const rolePermissions: { [key: string]: string[] } = {
      admin: [
        "users:read",
        "users:create",
        "users:update",
        "users:delete",
        "medications:read",
        "medications:create",
        "medications:update",
        "medications:delete",
        "clients:read",
        "clients:create",
        "clients:update",
        "clients:delete",
        "settings:read",
        "settings:update",
        "reports:read",
        "reports:create",
      ],
      manager: [
        "medications:read",
        "medications:create",
        "medications:update",
        "medications:delete",
        "clients:read",
        "clients:create",
        "clients:update",
        "clients:delete",
        "settings:read",
        "settings:update",
        "reports:read",
        "reports:create",
      ],
      pharmacist: [
        "medications:read",
        "medications:create",
        "medications:update",
        "clients:read",
        "clients:create",
        "clients:update",
        "reports:read",
      ],
      assistant: ["medications:read", "clients:read", "reports:read"],
    }

    const userPermissions = rolePermissions[this.currentUserValue.role] || []
    return userPermissions.includes(permission)
  }
}
