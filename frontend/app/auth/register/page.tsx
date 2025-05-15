import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "PharmaFlow - Inscription",
  description: "Créez votre compte PharmaFlow",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left side with illustration (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pharma-primary to-pharma-secondary items-center justify-center p-10 overflow-y-auto">
        <div className="max-w-md mx-auto py-6 mb-16">
          <div className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-16 h-16 mb-6 opacity-75"
            >
              <path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H3v1.5h3.973a3 3 0 0 0 4.277 4.204V21h1.5v-4.046a3 3 0 0 0 4.277-4.204H21v-1.5h-3.973a3 3 0 0 0-4.277-4.204V3h-1.5Z" />
            </svg>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Rejoignez PharmaFlow</h1>
            <p className="text-base sm:text-lg mb-6 opacity-90">
              Créez votre compte pour accéder à toutes les fonctionnalités de notre système de gestion de pharmacie.
            </p>
            
            <div className="bg-white/10 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-medium mb-4">Avantages de l'inscription</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="mr-3 bg-white/20 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-base">Accès à tous les modules du système</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-white/20 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-base">Tableau de bord personnalisé</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-white/20 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-base">Notifications et alertes en temps réel</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-white/20 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-base">Support technique dédié</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-10 bg-gradient-to-br from-pharma-primary/5 via-slate-50 to-pharma-secondary/5 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
} 