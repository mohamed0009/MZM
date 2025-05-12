"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { Pill, Mail, Lock, Eye, EyeOff, AlertCircle, User, UserPlus, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Define form schema with validation
const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  }),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation pour continuer"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const { signUp, error } = useAuth() || { signUp: null, error: null }; // Optional chaining in case AuthContext is not provided
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false)
  const { toast } = useToast()

  // Initialize form with schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  })

  // Track if form is valid for button state
  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setFormError(null)
    
    // Mock registration functionality
    try {
      // If signUp function is available in the AuthContext, use it
      if (signUp) {
        await signUp({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        });

        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
          variant: "default",
        });

        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        // Simulate successful registration if no Auth context
        console.log("Registration submitted:", values);
        
        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
          variant: "default",
        });

        // Redirect to login page
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {/* Logo and Brand */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div className="bg-gradient-to-r from-pharma-primary to-pharma-secondary p-3 rounded-full">
          <Pill className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center bg-gradient-to-r from-pharma-primary to-pharma-secondary bg-clip-text text-transparent">
          PharmaSys
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Créez votre compte pour commencer
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Prénom
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Jean" 
                          {...field} 
                          disabled={isLoading}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Nom
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Dupont" 
                          {...field} 
                          disabled={isLoading}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                  <FormDescription className="text-xs">
                    Minimum 6 caractères
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Confirmer le mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="••••••••" 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...field} 
                        disabled={isLoading}
                        className="pl-10 pr-10" 
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
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
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                      disabled={isLoading}
                      className="data-[state=checked]:bg-pharma-primary data-[state=checked]:border-pharma-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                      J'accepte les <a href="#" className="text-pharma-primary hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-pharma-primary hover:underline">politique de confidentialité</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
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
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="text-center text-sm mt-4">
        Vous avez déjà un compte?{" "}
        <Button variant="link" className="p-0 text-pharma-primary hover:text-pharma-secondary" asChild>
          <a href="/auth/login">Se connecter</a>
        </Button>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-8">
        <p>&copy; {new Date().getFullYear()} PharmaSys. Tous droits réservés.</p>
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