import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "MZM - Inscription",
  description: "Créez un compte MZM pour gérer votre pharmacie",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pharma-light to-white p-4">
      <SignupForm />
    </div>
  )
}
