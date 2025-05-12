import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill, Users, Bell, Calendar, BarChart, ShieldCheck, Clock, Search, FileText, TrendingUp } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Pill className="h-10 w-10" />,
      title: "Gestion d'inventaire avancée",
      description:
        "Suivez votre stock en temps réel, gérez les dates d'expiration et recevez des alertes automatiques pour les niveaux bas.",
      color: "bg-pharma-light text-pharma-primary",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Gestion des clients",
      description: "Créez et gérez des profils clients détaillés avec historique médical, ordonnances et préférences.",
      color: "bg-blue-50 text-blue-500",
    },
    {
      icon: <Bell className="h-10 w-10" />,
      title: "Système d'alertes intelligent",
      description:
        "Recevez des notifications pour les stocks bas, dates d'expiration, rappels de médicaments et plus encore.",
      color: "bg-amber-50 text-amber-500",
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Calendrier et rendez-vous",
      description:
        "Planifiez et gérez les rendez-vous, livraisons et événements importants dans un calendrier intégré.",
      color: "bg-purple-50 text-purple-500",
    },
    {
      icon: <BarChart className="h-10 w-10" />,
      title: "Rapports et analyses",
      description:
        "Générez des rapports détaillés sur les ventes, l'inventaire et les tendances pour prendre des décisions éclairées.",
      color: "bg-green-50 text-green-500",
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Contrôle d'accès sécurisé",
      description: "Définissez des rôles et permissions pour votre équipe avec un système d'authentification robuste.",
      color: "bg-red-50 text-red-500",
    },
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Suivi des ordonnances",
      description: "Gérez les ordonnances, les renouvellements et les historiques de prescription en toute simplicité.",
      color: "bg-indigo-50 text-indigo-500",
    },
    {
      icon: <Search className="h-10 w-10" />,
      title: "Recherche avancée",
      description:
        "Trouvez rapidement des médicaments, clients ou ordonnances avec notre moteur de recherche puissant.",
      color: "bg-pink-50 text-pink-500",
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Documentation automatisée",
      description: "Générez automatiquement des factures, reçus et autres documents essentiels.",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: <TrendingUp className="h-10 w-10" />,
      title: "Prévisions et tendances",
      description:
        "Anticipez les besoins en stock grâce à des analyses prédictives basées sur l'historique des ventes.",
      color: "bg-cyan-50 text-cyan-500",
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
            <Link href="/features" className="text-sm font-medium hover:underline text-pharma-primary">
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Fonctionnalités complètes</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Découvrez comment PharmaSys peut transformer la gestion de votre pharmacie avec ses fonctionnalités
                  puissantes et intuitives.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className={`rounded-full p-3 ${feature.color}`}>{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">Prêt à transformer votre pharmacie ?</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Rejoignez des centaines de pharmacies qui utilisent déjà PharmaSys pour optimiser leur gestion
                quotidienne.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
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
