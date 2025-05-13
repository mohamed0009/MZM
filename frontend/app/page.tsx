import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Pill, Users, Bell, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-pharma-primary" />
            <span className="text-xl font-bold">PharmaSys</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:underline">
              Fonctionnalités
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:underline">
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Gérez votre pharmacie avec efficacité
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    PharmaSys vous offre une solution complète pour la gestion de votre pharmacie, de l'inventaire aux
                    clients, en passant par les alertes et le calendrier.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-pharma-primary hover:bg-pharma-primary/90 text-white">
                      Commencer maintenant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button size="lg" variant="outline">
                      Découvrir les fonctionnalités
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl bg-muted/50 p-2 shadow-lg">
                  <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="flex flex-col gap-4">
                        <div className="rounded-lg bg-pharma-light p-4 flex items-center gap-3">
                          <div className="rounded-full bg-pharma-primary p-2 text-white">
                            <Pill className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Inventaire</p>
                            <p className="text-xs text-muted-foreground">1250 produits</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-4 flex items-center gap-3">
                          <div className="rounded-full bg-blue-500 p-2 text-white">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Clients</p>
                            <p className="text-xs text-muted-foreground">842 fiches</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="rounded-lg bg-amber-50 p-4 flex items-center gap-3">
                          <div className="rounded-full bg-amber-500 p-2 text-white">
                            <Bell className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Alertes</p>
                            <p className="text-xs text-muted-foreground">3 nouvelles</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4 flex items-center gap-3">
                          <div className="rounded-full bg-purple-500 p-2 text-white">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Calendrier</p>
                            <p className="text-xs text-muted-foreground">8 événements</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Fonctionnalités principales</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Tout ce dont vous avez besoin pour gérer votre pharmacie
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  PharmaSys combine tous les outils essentiels pour une gestion efficace et moderne de votre pharmacie.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pharma-light text-pharma-primary mb-4">
                  <Pill className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Inventaire</h3>
                <p className="text-muted-foreground">Gérez votre stock de médicaments et produits avec précision.</p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-500 mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Clients</h3>
                <p className="text-muted-foreground">Suivez les informations et l'historique de vos patients.</p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-500 mb-4">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Alertes</h3>
                <p className="text-muted-foreground">
                  Recevez des notifications pour les stocks bas et dates d'expiration.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-500 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Calendrier</h3>
                <p className="text-muted-foreground">Planifiez vos rendez-vous et événements importants.</p>
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
