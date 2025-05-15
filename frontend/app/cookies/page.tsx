"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cookie, Shield, Settings, Info } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function Cookies() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="min-h-[60vh] flex flex-col items-center justify-center py-24 bg-gradient-to-b from-blue-50 to-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Politique des Cookies
          </motion.h1>
          
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border p-8 text-slate-700 space-y-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-blue-700">
                Cette politique des cookies explique comment PharmaFlow utilise les cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site web. Elle explique ce que sont ces technologies et pourquoi nous les utilisons, ainsi que vos droits pour contrôler leur utilisation.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-blue-600" />
                Que sont les cookies ?
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Les cookies sont de petits fichiers texte qui sont stockés sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web de manière plus efficace, ainsi que pour fournir des informations aux propriétaires du site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Types de cookies que nous utilisons
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Cookies essentiels</h3>
                  <p className="text-slate-600 text-sm">
                    Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés dans nos systèmes. Ils sont généralement établis uniquement en réponse à des actions que vous effectuez qui constituent une demande de services, comme la définition de vos préférences de confidentialité, la connexion ou le remplissage de formulaires.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Cookies de performance</h3>
                  <p className="text-slate-600 text-sm">
                    Ces cookies nous permettent de compter les visites et les sources de trafic afin que nous puissions mesurer et améliorer les performances de notre site. Ils nous aident à savoir quelles pages sont les plus et les moins populaires et à voir comment les visiteurs se déplacent sur le site.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Cookies de fonctionnalité</h3>
                  <p className="text-slate-600 text-sm">
                    Ces cookies permettent au site web de fournir une fonctionnalité et une personnalisation améliorées. Ils peuvent être définis par nous ou par des fournisseurs tiers dont nous avons ajouté les services à nos pages.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Comment gérer vos cookies
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Vous pouvez définir votre navigateur pour qu'il refuse tous les cookies ou pour qu'il vous indique quand un cookie est envoyé. Cependant, si vous n'acceptez pas les cookies, vous ne pourrez peut-être pas utiliser certaines parties de notre site. Les procédures pour gérer les cookies varient selon le navigateur que vous utilisez.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <h3 className="font-medium text-slate-800 mb-2">Google Chrome</h3>
                  <p className="text-slate-600 text-sm">Comment gérer les cookies dans Chrome</p>
                </a>
                <a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <h3 className="font-medium text-slate-800 mb-2">Mozilla Firefox</h3>
                  <p className="text-slate-600 text-sm">Comment gérer les cookies dans Firefox</p>
                </a>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">Mises à jour de cette politique</h2>
              <p className="text-slate-600 leading-relaxed">
                Nous pouvons mettre à jour cette politique des cookies de temps à autre pour refléter, par exemple, les changements apportés aux cookies que nous utilisons ou pour d'autres raisons opérationnelles, légales ou réglementaires. Veuillez donc consulter régulièrement cette politique pour rester informé de notre utilisation des cookies et des technologies connexes.
              </p>
              <p className="text-sm text-slate-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
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
              © {new Date().getFullYear()} PharmaFlow. Tous droits réservés.
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