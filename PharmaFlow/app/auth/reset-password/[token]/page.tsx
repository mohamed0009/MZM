import type { Metadata } from "next"
import { NewPasswordForm } from "@/components/auth/new-password-form"

export const metadata: Metadata = {
  title: "MZM - Nouveau mot de passe",
  description: "Définissez un nouveau mot de passe pour votre compte",
}

export default function NewPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pharma-light to-white p-4">
      <NewPasswordForm token={params.token} />
    </div>
  )
}
