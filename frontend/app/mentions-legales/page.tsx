"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function MentionsLegales() {
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
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent mb-4">Mentions légales</motion.h1>
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border p-8 text-slate-700 space-y-6">
            <section>
              <h2 className="font-bold text-blue-700 mb-2">Éditeur du site</h2>
              <p>PharmaFlow, édité par PharmaSys SARL<br/>Siège social : 123 Avenue de la Santé, Casablanca, Maroc<br/>Email : contact@pharmaflow.com<br/>Téléphone : +212 5 22 00 00 00</p>
            </section>
            <section>
              <h2 className="font-bold text-blue-700 mb-2">Hébergement</h2>
              <p>OVH Maroc<br/>Adresse : 100 Rue de l'Hébergement, Casablanca, Maroc<br/>Téléphone : +212 5 22 11 22 33</p>
            </section>
            <section>
              <h2 className="font-bold text-blue-700 mb-2">Responsabilité</h2>
              <p>PharmaFlow s'efforce de fournir des informations fiables et à jour, mais ne saurait être tenu responsable des erreurs ou omissions, ni de l'usage qui pourrait être fait de ces informations.</p>
            </section>
            <section>
              <h2 className="font-bold text-blue-700 mb-2">Données personnelles</h2>
              <p>Les informations collectées via le site sont destinées exclusivement à PharmaFlow. Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à l'adresse ci-dessus.</p>
            </section>
            <section>
              <h2 className="font-bold text-blue-700 mb-2">Propriété intellectuelle</h2>
              <p>Tous les contenus présents sur ce site (textes, images, logos, etc.) sont la propriété exclusive de PharmaFlow ou de ses partenaires. Toute reproduction, représentation ou diffusion, totale ou partielle, est interdite sans autorisation écrite préalable.</p>
            </section>
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