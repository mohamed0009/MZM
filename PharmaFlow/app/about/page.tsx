import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill, CheckCircle } from "lucide-react"

export default function About() {
  const teamMembers = [
    {
      name: "Dr. Sarah Benali",
      role: "Fondatrice & CEO",
      bio: "Pharmacienne avec plus de 15 ans d'expérience, Dr. Benali a créé PharmaSys pour résoudre les problèmes qu'elle rencontrait quotidiennement.",
      avatar: "/confident-leader.png",
    },
    {
      name: "Mohammed Alaoui",
      role: "Directeur Technique",
      bio: "Expert en développement logiciel avec une spécialisation dans les solutions pour le secteur de la santé.",
      avatar: "/confident-executive.png",
    },
    {
      name: "Leila Tazi",
      role: "Responsable Produit",
      bio: "Ancienne consultante en pharmacie, Leila comprend parfaitement les besoins des pharmaciens modernes.",
      avatar: "/confident-leader.png",
    },
  ]

  const values = [
    {
      title: "Innovation",
      description:
        "Nous repoussons constamment les limites pour créer des solutions qui anticipent les besoins futurs.",
    },
    {
      title: "Fiabilité",
      description:
        "Nos systèmes sont conçus pour fonctionner 24/7, car nous savons que votre pharmacie ne peut pas se permettre de temps d'arrêt.",
    },
    {
      title: "Simplicité",
      description:
        "Malgré la puissance de nos outils, nous nous efforçons de les rendre intuitifs et faciles à utiliser.",
    },
    {
      title: "Sécurité",
      description: "La protection des données sensibles de vos clients est notre priorité absolue.",
    },
  ]

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
            <Link href="/about" className="text-sm font-medium hover:underline text-pharma-primary">
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
            <Link href="/auth/signup" className="hidden md:block">
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Notre Histoire</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Découvrez comment PharmaSys est né d'une vision pour transformer la gestion des pharmacies.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Notre mission</h2>
                <p className="text-muted-foreground">
                  Chez PharmaSys, notre mission est de simplifier la gestion des pharmacies grâce à des outils
                  technologiques innovants, permettant aux pharmaciens de se concentrer sur ce qui compte vraiment : la
                  santé de leurs patients.
                </p>
                <p className="text-muted-foreground">
                  Nous croyons que chaque pharmacie, quelle que soit sa taille, mérite d'avoir accès à des outils de
                  gestion de classe mondiale qui améliorent l'efficacité, réduisent les erreurs et optimisent les
                  opérations quotidiennes.
                </p>
                <div className="pt-4">
                  <h3 className="text-xl font-bold mb-4">Nos valeurs</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {values.map((value, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-1 h-5 w-5 text-pharma-primary flex-shrink-0" />
                        <div>
                          <h4 className="font-bold">{value.title}</h4>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] overflow-hidden rounded-xl bg-muted">
                <img
                  src="/bright-modern-pharmacy.png"
                  alt="L'équipe PharmaSys au travail"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold">Notre équipe</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Des experts passionnés par l'innovation dans le secteur pharmaceutique.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 text-center"
                >
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm text-pharma-primary font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold">Rejoignez-nous</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Prêt à transformer la gestion de votre pharmacie ? Commencez dès aujourd'hui avec PharmaSys.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-pharma-primary hover:bg-pharma-primary/90 text-white">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Nous contacter
                  </Button>
                </Link>
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
