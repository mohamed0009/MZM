"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function Tarifs() {
  const plans = [
    {
      name: "Essentiel",
      price: "Gratuit",
      desc: "Pour les petites pharmacies qui débutent avec PharmaFlow.",
      features: [
        "Gestion de l'inventaire",
        "Fiches clients basiques",
        "Alertes de stock",
        "Support par email",
      ],
      cta: "Commencer",
      highlight: false,
    },
    {
      name: "Pro",
      price: "299 DH/mois",
      desc: "Pour les pharmacies en croissance qui veulent plus d'automatisation.",
      features: [
        "Toutes les fonctionnalités Essentiel",
        "Gestion avancée des clients",
        "Rapports & analyses",
        "Support prioritaire",
        "Intégration calendrier",
      ],
      cta: "Essayer Pro",
      highlight: true,
    },
    {
      name: "Entreprise",
      price: "Sur devis",
      desc: "Pour les grandes structures ou réseaux de pharmacies.",
      features: [
        "Toutes les fonctionnalités Pro",
        "Personnalisation avancée",
        "Formation dédiée",
        "Gestion multi-sites",
        "Support 24/7",
      ],
      cta: "Contactez-nous",
      highlight: false,
    },
  ];

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
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent mb-4">Tarifs</motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2, duration:0.5}} className="text-slate-600 text-lg text-center max-w-xl mb-12">Choisissez l'offre qui correspond à vos besoins. Sans engagement, évolutif à tout moment.</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                className={`rounded-2xl border bg-white p-8 shadow-lg flex flex-col items-center ${plan.highlight ? 'border-blue-600 shadow-blue-100 scale-105' : 'border-gray-100'}`}
              >
                <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-blue-600' : 'text-slate-800'}`}>{plan.name}</h2>
                <p className="text-3xl font-bold mb-2">{plan.price}</p>
                <p className="text-slate-500 mb-6 text-center">{plan.desc}</p>
                <ul className="mb-8 space-y-2 w-full">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-700"><span className="text-blue-500">•</span> {f}</li>
                  ))}
                </ul>
                <Link href={plan.name === "Entreprise" ? "/contact" : "/auth/register"}>
                  <Button className={`w-full ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>{plan.cta}</Button>
                </Link>
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