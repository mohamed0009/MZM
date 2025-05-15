import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "PharmaFlow - Réinitialisation du mot de passe",
  description: "Réinitialisez votre mot de passe PharmaFlow",
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="w-full flex items-center justify-center p-4 sm:p-8 md:p-10 bg-gradient-to-br from-pharma-primary/5 via-slate-50 to-pharma-secondary/5 overflow-y-auto">
        <div className="w-full max-w-md py-10">
      <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
