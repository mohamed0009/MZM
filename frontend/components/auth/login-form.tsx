"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pill, Mail, Lock, Eye, EyeOff, AlertCircle, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Define our form schema
const formSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  }),
  rememberMe: z.boolean().default(false),
})

export function LoginForm() {
  const { login, error } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const { toast } = useToast()

  // Initialize the form with our schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Track if form is valid for button state
  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setFormError(null)
    
    try {
      console.log("Submitting login with:", values.email, values.password)
      const success = await login(values.email, values.password)
      
      if (success) {
        // Show success message
        toast({
          title: "Connexion réussie",
          description: "Vous allez être redirigé vers le tableau de bord",
          variant: "default",
        })
        
        // Redirect to dashboard
        console.log("Login successful, redirecting to dashboard")
        
        // Option 1: Using Next.js router (preferred for client navigation)
        router.push("/dashboard")
        
        // Option 2: Using direct navigation as fallback
        setTimeout(() => {
          console.log("Fallback redirect after timeout")
          window.location.href = "/dashboard"
        }, 2000)
      } else {
        setIsLoading(false)
        setFormError("La connexion a échoué. Veuillez vérifier vos identifiants.")
        toast({
          title: "Erreur de connexion",
          description: "Identifiants incorrects. Veuillez réessayer.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      setFormError("Une erreur inattendue s'est produite. Veuillez réessayer.")
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6">
      {/* Logo and Brand */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 bg-pharma-primary rounded-full animate-pulse opacity-60"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-pharma-primary rounded-full">
            <Heart 
              className="text-white" 
              fill="white" 
              size={28} 
            />
            <svg 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
              width={18} 
              height={10} 
              viewBox="0 0 16 8" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0 4H3L4 1L6 7L8 4L9 5L11 2L13 4H16" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="heartbeat-line text-pharma-secondary"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-pharma-primary to-pharma-secondary bg-clip-text text-transparent">
          PharmaFlow
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Connectez-vous à votre compte pour continuer
        </p>
      </div>

      {(error || formError) && (
        <Alert variant="destructive" className="animate-fadeIn flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || formError}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="votre.email@exemple.com" 
                        type="email" 
                        {...field} 
                        disabled={isLoading}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"} 
                        {...field} 
                        disabled={isLoading}
                        className="pl-10 pr-10" 
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        disabled={isLoading}
                        className="data-[state=checked]:bg-pharma-primary data-[state=checked]:border-pharma-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      Se souvenir de moi
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button 
                variant="link" 
                className="text-sm text-pharma-primary hover:text-pharma-secondary p-0" 
                asChild
              >
                <a href="/auth/forgot-password">Mot de passe oublié?</a>
              </Button>
            </div>
            <Button 
              type="submit" 
              className={cn(
                "w-full bg-gradient-to-r from-pharma-primary to-pharma-secondary hover:from-pharma-primary/90 hover:to-pharma-secondary/90 transition-all",
                "mt-2 h-11"
              )} 
              disabled={isLoading || (!isValid && isDirty)}
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="text-center text-sm mt-4">
        Vous n&apos;avez pas de compte?{" "}
        <Button variant="link" className="p-0 text-pharma-primary hover:text-pharma-secondary" asChild>
          <a href="/auth/register">Créer un compte</a>
        </Button>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8">
        <p>&copy; {new Date().getFullYear()} PharmaFlow. Tous droits réservés.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-pharma-primary">Aide</a>
          <a href="#" className="hover:text-pharma-primary">Confidentialité</a>
          <a href="#" className="hover:text-pharma-primary">Conditions</a>
        </div>
      </div>
      
      <Toaster />
    </div>
  )
}
