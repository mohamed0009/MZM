"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill, Users, Bell, Calendar, BarChart, ShieldCheck, Clock, Search, FileText, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedLogo from "@/components/AnimatedLogo"

export default function Features() {
  const features = [
    {
      icon: <Pill className="h-10 w-10" />, title: "Gestion d'inventaire avancée", description: "Suivez votre stock en temps réel, gérez les dates d'expiration et recevez des alertes automatiques pour les niveaux bas.", color: "from-teal-50 to-teal-100", iconBg: "bg-teal-500", delay: 0.1
    },
    {
      icon: <Users className="h-10 w-10" />, title: "Gestion des clients", description: "Créez et gérez des profils clients détaillés avec historique médical, ordonnances et préférences.", color: "from-blue-50 to-blue-100", iconBg: "bg-blue-500", delay: 0.2
    },
    {
      icon: <Bell className="h-10 w-10" />, title: "Système d'alertes intelligent", description: "Recevez des notifications pour les stocks bas, dates d'expiration, rappels de médicaments et plus encore.", color: "from-amber-50 to-amber-100", iconBg: "bg-amber-500", delay: 0.3
    },
    {
      icon: <Calendar className="h-10 w-10" />, title: "Calendrier et rendez-vous", description: "Planifiez et gérez les rendez-vous, livraisons et événements importants dans un calendrier intégré.", color: "from-purple-50 to-purple-100", iconBg: "bg-purple-500", delay: 0.4
    },
    {
      icon: <BarChart className="h-10 w-10" />, title: "Rapports et analyses", description: "Générez des rapports détaillés sur les ventes, l'inventaire et les tendances pour prendre des décisions éclairées.", color: "from-green-50 to-green-100", iconBg: "bg-green-500", delay: 0.5
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />, title: "Contrôle d'accès sécurisé", description: "Définissez des rôles et permissions pour votre équipe avec un système d'authentification robuste.", color: "from-red-50 to-red-100", iconBg: "bg-red-500", delay: 0.6
    },
    {
      icon: <Clock className="h-10 w-10" />, title: "Suivi des ordonnances", description: "Gérez les ordonnances, les renouvellements et les historiques de prescription en toute simplicité.", color: "from-indigo-50 to-indigo-100", iconBg: "bg-indigo-500", delay: 0.7
    },
    {
      icon: <Search className="h-10 w-10" />, title: "Recherche avancée", description: "Trouvez rapidement des médicaments, clients ou ordonnances avec notre moteur de recherche puissant.", color: "from-pink-50 to-pink-100", iconBg: "bg-pink-500", delay: 0.8
    },
    {
      icon: <FileText className="h-10 w-10" />, title: "Documentation automatisée", description: "Générez automatiquement des factures, reçus et autres documents essentiels.", color: "from-yellow-50 to-yellow-100", iconBg: "bg-yellow-500", delay: 0.9
    },
    {
      icon: <TrendingUp className="h-10 w-10" />, title: "Prévisions et tendances", description: "Anticipez les besoins en stock grâce à des analyses prédictives basées sur l'historique des ventes.", color: "from-cyan-50 to-cyan-100", iconBg: "bg-cyan-500", delay: 1.0
    },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.08, duration: 0.6, type: "spring", stiffness: 80 }
    })
  }

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
            <Link href="/features" className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
              Fonctionnalités
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
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
                  Fonctionnalités complètes
                </h1>
                <p className="max-w-[900px] text-slate-600 md:text-xl">
                  Découvrez comment PharmaFlow peut transformer la gestion de votre pharmacie avec ses fonctionnalités puissantes et intuitives.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
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

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-start gap-4 rounded-2xl border p-8 shadow-md bg-white hover:shadow-xl transition-all group relative overflow-hidden"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <div className={`rounded-full p-4 bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform ${feature.iconBg} shadow-lg`}>{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-all"></div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 flex flex-col items-center justify-center space-y-4 text-center">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Prêt à transformer votre pharmacie ?
              </motion.h2>
              <motion.p 
                className="max-w-[600px] text-slate-600 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Rejoignez des centaines de pharmacies qui utilisent déjà PharmaFlow pour optimiser leur gestion quotidienne.
              </motion.p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-2">
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
