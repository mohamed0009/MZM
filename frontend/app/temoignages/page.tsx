"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";

const testimonials = [
  {
    name: "Dr. Nadia El Amrani",
    pharmacy: "Pharmacie Centrale, Casablanca",
    quote: "PharmaFlow a révolutionné la gestion de notre pharmacie. L'automatisation des alertes et la simplicité d'utilisation sont incomparables !",
  },
  {
    name: "M. Karim Berrada",
    pharmacy: "Pharmacie Berrada, Rabat",
    quote: "Grâce à PharmaFlow, nous avons réduit les erreurs de stock et gagné un temps précieux chaque jour. Je recommande vivement !",
  },
  {
    name: "Dr. Leila Tazi",
    pharmacy: "Pharmacie Tazi, Marrakech",
    quote: "L'équipe support est très réactive et l'outil évolue constamment. C'est un vrai partenaire pour notre activité !",
  },
  {
    name: "Mme. Samira Fassi",
    pharmacy: "Pharmacie Fassi, Fès",
    quote: "La gestion des clients et des ordonnances n'a jamais été aussi simple. Merci PharmaFlow !",
  },
];

export default function Temoignages() {
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
        <section className="min-h-[60vh] flex flex-col items-center justify-center py-24 bg-gradient-to-b from-blue-50 to-white">
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent mb-4">Témoignages</motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2, duration:0.5}} className="text-slate-600 text-lg text-center max-w-xl mb-12">Découvrez ce que nos clients pensent de PharmaFlow.</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="rounded-2xl border bg-white p-8 shadow-lg flex flex-col items-center border-blue-100"
              >
                <p className="text-lg italic text-slate-700 mb-4">“{t.quote}”</p>
                <div className="font-bold text-blue-600">{t.name}</div>
                <div className="text-slate-500 text-sm">{t.pharmacy}</div>
              </motion.div>
            ))}
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
  );
} 