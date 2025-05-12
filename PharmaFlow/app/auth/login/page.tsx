import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "PharmaSys - Connexion",
  description: "Connectez-vous à votre compte PharmaSys",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-pharma-primary/5 via-slate-50 to-pharma-secondary/5">
      {/* Left side with illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pharma-primary to-pharma-secondary items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-20 h-20 mb-6 opacity-75"
            >
              <path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H3v1.5h3.973a3 3 0 0 0 4.277 4.204V21h1.5v-4.046a3 3 0 0 0 4.277-4.204H21v-1.5h-3.973a3 3 0 0 0-4.277-4.204V3h-1.5Z" />
            </svg>

            <h1 className="text-4xl font-bold mb-6">Bienvenue sur PharmaSys</h1>
            <p className="text-lg mb-8 opacity-90">
              Gérez votre pharmacie efficacement avec notre système complet d'administration, d'inventaire et de service client.
            </p>
            
            <div className="bg-white/10 rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Fonctionnalités principales</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 bg-white/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Gestion d'inventaire en temps réel
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-white/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Suivi des ventes et des ordonnances
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-white/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Base de données clients et prescripteurs
                </li>
                <li className="flex items-center">
                  <div className="mr-2 bg-white/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Rapports et analyses avancés
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
