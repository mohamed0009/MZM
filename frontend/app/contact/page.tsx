"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pill, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedLogo from "@/components/AnimatedLogo"

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
            <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md">
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
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-teal-50 to-transparent rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                  Contactez-nous
                </h1>
                <p className="max-w-[900px] text-slate-600 md:text-xl">
                  Nous sommes là pour répondre à toutes vos questions et vous aider à démarrer avec PharmaFlow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">Nous contacter</h2>
                  <p className="text-slate-600">
                    Notre équipe est disponible pour vous aider avec toutes vos questions concernant PharmaFlow.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Email</h3>
                      <p className="text-slate-600">contact@pharmaflow.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Téléphone</h3>
                      <p className="text-slate-600">+212 522 123 456</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold">Adresse</h3>
                      <p className="text-slate-600">
                        123 Avenue Mohammed V<br />
                        Casablanca, 20000<br />
                        Maroc
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="rounded-2xl border bg-white p-8 shadow-lg"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none">Nom complet</label>
                    <Input id="name" placeholder="Entrez votre nom" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                    <Input id="email" type="email" placeholder="Entrez votre email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium leading-none">Sujet</label>
                    <Input id="subject" placeholder="Sujet de votre message" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none">Message</label>
                    <Textarea id="message" placeholder="Votre message" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all text-white">
                    Envoyer le message
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
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
