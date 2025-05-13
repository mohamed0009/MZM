import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pill, Mail, Phone, MapPin } from "lucide-react"

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-pharma-primary" />
            <span className="text-xl font-bold">PharmaSys</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:underline">
              Fonctionnalités
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline text-pharma-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/auth/register" className="hidden md:block">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-pharma-light/50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contactez-nous</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Nous sommes là pour répondre à toutes vos questions et vous aider à démarrer avec PharmaSys.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Nous contacter</h2>
                  <p className="text-muted-foreground">
                    Notre équipe est disponible pour vous aider avec toutes vos questions concernant PharmaSys.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 text-pharma-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Email</h3>
                      <p className="text-muted-foreground">contact@pharmasys.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 text-pharma-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Téléphone</h3>
                      <p className="text-muted-foreground">+212 522 123 456</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-5 w-5 text-pharma-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Adresse</h3>
                      <p className="text-muted-foreground">
                        123 Avenue Mohammed V<br />
                        Casablanca, 20000
                        <br />
                        Maroc
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-background p-8">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nom complet
                    </label>
                    <Input id="name" placeholder="Entrez votre nom" />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Entrez votre email" />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sujet
                    </label>
                    <Input id="subject" placeholder="Sujet de votre message" />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <Textarea id="message" placeholder="Votre message" className="min-h-[150px]" />
                  </div>

                  <Button type="submit" className="w-full bg-pharma-primary hover:bg-pharma-primary/90 text-white">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 PharmaSys. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Conditions d'utilisation
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
