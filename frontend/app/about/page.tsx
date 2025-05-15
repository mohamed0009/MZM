"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedLogo from "@/components/AnimatedLogo"

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
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/">
            <AnimatedLogo size="lg" showText />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/about" className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="hover:border-blue-600 hover:text-blue-600 transition-all">Connexion</Button>
            </Link>
            <Link href="/auth/register" className="hidden md:block">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all">
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-teal-50 to-transparent rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                  Notre Histoire
                </h1>
                <p className="max-w-[900px] text-slate-600 md:text-xl">
                  Découvrez comment PharmaFlow est né d'une vision pour transformer la gestion des pharmacies.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Notre mission</h2>
                <p className="text-slate-600">
                  Chez PharmaFlow, notre mission est de simplifier la gestion des pharmacies grâce à des outils technologiques innovants, permettant aux pharmaciens de se concentrer sur ce qui compte vraiment : la santé de leurs patients.
                </p>
                <p className="text-slate-600">
                  Nous croyons que chaque pharmacie, quelle que soit sa taille, mérite d'avoir accès à des outils de gestion de classe mondiale qui améliorent l'efficacité, réduisent les erreurs et optimisent les opérations quotidiennes.
                </p>
                <div className="pt-4">
                  <h3 className="text-xl font-bold mb-4">Nos valeurs</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {values.map((value, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        <CheckCircle className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">{value.title}</h4>
                          <p className="text-sm text-slate-600">{value.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="relative h-[400px] overflow-hidden rounded-xl bg-muted"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <img
                  src="/bright-modern-pharmacy.png"
                  alt="L'équipe PharmaFlow au travail"
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Notre équipe</h2>
              <p className="max-w-[600px] text-slate-600">
                Des experts passionnés par l'innovation dans le secteur pharmaceutique.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-4 rounded-2xl border bg-white p-8 text-center shadow-md hover:shadow-xl transition-all group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                    <p className="text-sm text-slate-600">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Rejoignez-nous</h2>
              <p className="max-w-[600px] text-slate-600">
                Prêt à transformer la gestion de votre pharmacie ? Commencez dès aujourd'hui avec PharmaFlow.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all text-white">
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="hover:border-blue-600 hover:text-blue-600">
                    Nous contacter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <motion.footer 
        className="border-t py-12 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/">
                <AnimatedLogo size="lg" showText />
              </Link>
              <p className="text-slate-600 max-w-sm mt-4">
                Solution complète de gestion pour les pharmacies modernes. Simplifiez votre quotidien et concentrez-vous sur l'essentiel.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Produit</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-slate-600 hover:text-blue-600 transition-colors">Fonctionnalités</Link></li>
                <li><Link href="/tarifs" className="text-slate-600 hover:text-blue-600 transition-colors">Tarifs</Link></li>
                <li><Link href="/temoignages" className="text-slate-600 hover:text-blue-600 transition-colors">Témoignages</Link></li>
                <li><Link href="/faq" className="text-slate-600 hover:text-blue-600 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">À propos</Link></li>
                <li><Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</Link></li>
                <li><Link href="/carrieres" className="text-slate-600 hover:text-blue-600 transition-colors">Carrières</Link></li>
                <li><Link href="/mentions-legales" className="text-slate-600 hover:text-blue-600 transition-colors">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t">
            <p className="text-center text-sm leading-loose text-slate-600 md:text-left">
              © 2025 PharmaFlow. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cookies" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
