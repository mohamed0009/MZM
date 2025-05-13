import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "MZM - Réinitialisation du mot de passe",
  description: "Réinitialisez votre mot de passe MZM",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pharma-light to-white p-4">
      <ResetPasswordForm />
    </div>
  )
}
