"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, FileText, ExternalLink, UserCog, Bell, Info } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
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
      </div>

      <main className="flex-1">
        <section className="min-h-[60vh] flex flex-col items-center justify-center py-24 bg-gradient-to-b from-blue-50 to-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Politique de Confidentialité
          </motion.h1>
          
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border p-8 text-slate-700 space-y-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-blue-700">
                Chez PharmaFlow, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité détaille comment nous collectons, utilisons, protégeons et partageons vos informations lorsque vous utilisez notre service.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Protection des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nous protégeons vos données personnelles en utilisant des normes de cryptage de pointe et en nous conformant à toutes les réglementations pertinentes en matière de protection des données, y compris le RGPD. Toutes les informations personnelles et de santé sont stockées avec un cryptage de bout en bout, et l'accès est strictement contrôlé par des méthodes d'authentification sécurisées.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Collecte et utilisation des données
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Données que nous collectons</h3>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                    <li>Informations d'identification (nom, email, numéro de téléphone)</li>
                    <li>Informations professionnelles (numéro de licence, spécialité)</li>
                    <li>Données d'utilisation et de performance</li>
                    <li>Informations sur l'appareil et le navigateur</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Utilisation des données</h3>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                    <li>Fournir et améliorer nos services</li>
                    <li>Personnaliser votre expérience</li>
                    <li>Communiquer avec vous</li>
                    <li>Assurer la sécurité et la conformité</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Sécurité des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nous mettons en œuvre plusieurs couches de sécurité, notamment le cryptage des données, les contrôles d'accès sécurisés, les systèmes de détection d'intrusion et des audits de sécurité réguliers. Notre application suit des pratiques de développement sécurisées et fait l'objet de tests de pénétration pour identifier et corriger les vulnérabilités potentielles.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600" />
                Stockage et conservation des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Vos données sont stockées sur des serveurs cloud sécurisés avec des systèmes de redondance et de sauvegarde. Toutes les données sont cryptées à la fois en transit et au repos. Nous maintenons des contrôles d'accès stricts et des journaux d'activité pour protéger vos informations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <UserCog className="w-5 h-5 text-blue-600" />
                Vos droits
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Communications
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nous pouvons vous envoyer des communications importantes concernant votre compte ou nos services. Vous pouvez gérer vos préférences de communication dans les paramètres de votre compte ou en nous contactant directement.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Modifications de la politique
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous informerons de tout changement important par email ou par une notification sur notre site.
              </p>
              <p className="text-sm text-slate-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">Nous contacter</h2>
              <p className="text-slate-600 leading-relaxed">
                Si vous avez des questions concernant cette politique de confidentialité ou la façon dont nous traitons vos données, veuillez contacter notre délégué à la protection des données :
              </p>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600">
                  Email : privacy@pharmaflow.com<br />
                  Adresse : 123 Avenue de la Santé, Casablanca, Maroc
                </p>
              </div>
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