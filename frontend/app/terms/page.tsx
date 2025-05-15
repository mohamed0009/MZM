"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Scale, AlertTriangle, Shield, UserCheck, Info, ExternalLink } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function Terms() {
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
            Conditions d'Utilisation
          </motion.h1>
          
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border p-8 text-slate-700 space-y-8">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-sm text-blue-700">
                En utilisant PharmaFlow, vous acceptez ces conditions d'utilisation. Veuillez les lire attentivement. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Acceptation des conditions
              </h2>
              <p className="text-slate-600 leading-relaxed">
                En accédant à PharmaFlow et en utilisant nos services, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Compte utilisateur
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Inscription et sécurité</h3>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                    <li>Vous devez fournir des informations exactes lors de l'inscription</li>
                    <li>Vous êtes responsable de maintenir la confidentialité de votre compte</li>
                    <li>Vous devez nous informer immédiatement de toute utilisation non autorisée</li>
                    <li>Nous nous réservons le droit de désactiver tout compte utilisateur à notre seule discrétion</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Restrictions d'utilisation</h3>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-2">
                    <li>Vous devez être âgé d'au moins 18 ans</li>
                    <li>Vous devez avoir les autorisations nécessaires pour exercer en tant que professionnel de santé</li>
                    <li>Vous ne devez pas utiliser le service à des fins illégales</li>
                    <li>Vous ne devez pas tenter de compromettre la sécurité du service</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Propriété intellectuelle
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Le contenu, l'organisation, la compilation, la base de données, les graphiques, les photographies, les illustrations, les clips audio, les téléchargements numériques et les logiciels de PharmaFlow sont protégés par les lois sur le droit d'auteur, les marques de commerce et autres droits de propriété intellectuelle. La reproduction, la modification, la distribution ou la republication de tout matériel provenant de PharmaFlow est strictement interdite sans notre autorisation écrite préalable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                Limitations de responsabilité
              </h2>
              <p className="text-slate-600 leading-relaxed">
                PharmaFlow fournit ses services "tels quels" et "selon disponibilité". Nous ne garantissons pas que notre service sera ininterrompu, opportun, sécurisé ou sans erreur. Nous ne sommes pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de votre utilisation ou de votre incapacité à utiliser le service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Modifications des conditions
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Votre utilisation continue de PharmaFlow après la publication des modifications constitue votre acceptation des nouvelles conditions.
              </p>
              <p className="text-sm text-slate-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">Loi applicable</h2>
              <p className="text-slate-600 leading-relaxed">
                Ces conditions sont régies et interprétées conformément aux lois du Maroc, et vous vous soumettez irrévocablement à la juridiction exclusive des tribunaux de Casablanca pour la résolution de tout litige.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">Nous contacter</h2>
              <p className="text-slate-600 leading-relaxed">
                Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter :
              </p>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600">
                  Email : legal@pharmaflow.com<br />
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