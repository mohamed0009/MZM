"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";

const jobs = [
  {
    title: "Développeur(se) Full Stack",
    location: "Casablanca / Télétravail",
    type: "CDI",
    desc: "Participez au développement de nouvelles fonctionnalités innovantes pour les pharmacies du futur.",
  },
  {
    title: "Chargé(e) Support Client",
    location: "Casablanca",
    type: "CDI",
    desc: "Accompagnez nos clients dans leur utilisation de PharmaFlow et contribuez à leur satisfaction.",
  },
  {
    title: "Product Owner Junior",
    location: "Casablanca / Télétravail",
    type: "Stage / CDI",
    desc: "Aidez à définir la roadmap produit et à prioriser les évolutions selon les besoins des pharmaciens.",
  },
];

export default function Carrieres() {
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
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent mb-4">Carrières</motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2, duration:0.5}} className="text-slate-600 text-lg text-center max-w-xl mb-12">Rejoignez l'équipe PharmaFlow et contribuez à l'innovation dans le secteur pharmaceutique !</motion.p>
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className="rounded-2xl border bg-white p-8 shadow-lg flex flex-col border-blue-100"
              >
                <div className="text-xl font-bold text-blue-700 mb-2">{job.title}</div>
                <div className="text-slate-500 mb-2">{job.location} • {job.type}</div>
                <div className="text-slate-700 mb-4">{job.desc}</div>
                <a href={`mailto:contact@pharmaflow.com?subject=Candidature%20-%20${encodeURIComponent(job.title)}`} className="inline-block mt-auto text-blue-600 hover:underline font-medium">Postuler</a>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-slate-700 mb-2">Aucune offre ne correspond à votre profil ?</div>
            <a href="mailto:contact@pharmaflow.com" className="text-blue-600 hover:underline font-medium">Envoyez-nous une candidature spontanée</a>
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