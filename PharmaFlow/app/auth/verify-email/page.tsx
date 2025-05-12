import type { Metadata } from "next"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"

export const metadata: Metadata = {
  title: "MZM - Vérification d'email",
  description: "Vérifiez votre adresse email pour activer votre compte",
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pharma-light to-white p-4">
      <VerifyEmailForm />
    </div>
  )
}
