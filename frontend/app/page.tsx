"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  Pill, 
  Users, 
  Bell, 
  Calendar, 
  ShoppingBag, 
  ChevronDown, 
  Check, 
  Star, 
  Heart 
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import ECGAnimation from "@/components/ECGAnimation"
import AnimatedLogo from "@/components/AnimatedLogo"

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Animated Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/">
            <AnimatedLogo size="lg" showText={true} />
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
        {/* Hero Section with Animation */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-50 to-transparent rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-teal-50 to-transparent rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[500px] opacity-5 -z-10">
            <ECGAnimation 
              width={1200} 
              height={500} 
              color="#3b82f6" 
              speed={1} 
              showBackground={false}
              strokeWidth={4}
            />
          </div>
          
          <div className="container px-4 md:px-6">
            <motion.div 
              className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="flex flex-col justify-center space-y-4"
                variants={itemVariants}
              >
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      Solution de gestion pharmaceutique
                    </span>
                  </motion.div>
                  <motion.h1 
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    variants={itemVariants}
                  >
                    <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                    Gérez votre pharmacie avec efficacité
                    </span>
                  </motion.h1>
                  <motion.p 
                    className="max-w-[600px] text-slate-600 md:text-xl"
                    variants={itemVariants}
                  >
                    PharmaFlow vous offre une solution complète pour la gestion de votre pharmacie, de l'inventaire aux
                    clients, en passant par les alertes et le calendrier.
                  </motion.p>
                </div>
                <motion.div 
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  variants={itemVariants}
                >
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all text-white">
                      Commencer maintenant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button size="lg" variant="outline" className="hover:border-blue-600 hover:text-blue-600">
                      Découvrir les fonctionnalités
                    </Button>
                  </Link>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-sm text-slate-500 mt-4"
                  variants={itemVariants}
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gradient-to-b ${
                        i % 2 === 0 ? 'from-blue-100 to-blue-200' : 'from-teal-100 to-teal-200'
                      }`}>
                      </div>
                    ))}
                  </div>
                  <p>Rejoint par <span className="font-medium text-blue-600">500+</span> pharmacies</p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center relative"
                variants={itemVariants}
              >
                <div className="relative w-full max-w-[600px] aspect-[5/3] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-gray-100/50">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gray-50 rounded-t-xl flex items-center px-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
              </div>
                  
                  <div className="pt-12 p-4 bg-white rounded-xl h-full">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <motion.div 
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 p-4 flex items-center gap-3 group hover:shadow-md transition-all">
                          <div className="rounded-full bg-teal-500 p-2 text-white group-hover:scale-110 transition-transform">
                            <Pill className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Inventaire</p>
                            <p className="text-xs text-slate-500">1250 produits</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center gap-3 group hover:shadow-md transition-all">
                          <div className="rounded-full bg-blue-500 p-2 text-white group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Clients</p>
                            <p className="text-xs text-slate-500">842 fiches</p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-4 flex items-center gap-3 group hover:shadow-md transition-all">
                          <div className="rounded-full bg-amber-500 p-2 text-white group-hover:scale-110 transition-transform">
                            <Bell className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Alertes</p>
                            <p className="text-xs text-slate-500">3 nouvelles</p>
                          </div>
                        </div>
                        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4 flex items-center gap-3 group hover:shadow-md transition-all">
                          <div className="rounded-full bg-purple-500 p-2 text-white group-hover:scale-110 transition-transform">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Calendrier</p>
                            <p className="text-xs text-slate-500">8 événements</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* ECG Animation on the UI */}
                  <div className="absolute bottom-4 left-4 right-4 h-5 opacity-40">
                    <ECGAnimation 
                      width={550} 
                      height={20} 
                      color="#3b82f6" 
                      speed={1.2} 
                      showBackground={false}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                
                {/* Floating cards */}
                <motion.div 
                  className="absolute -bottom-8 -right-8 bg-white rounded-lg p-3 shadow-lg border border-gray-100 max-w-[160px]"
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <p className="text-xs font-medium">Satisfaction</p>
              </div>
                  <p className="text-xl font-bold text-blue-600">98%</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
            </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section with Animation */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                  Fonctionnalités principales
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                  Tout ce dont vous avez besoin pour gérer votre pharmacie
                  </span>
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  PharmaFlow combine tous les outils essentiels pour une gestion efficace et moderne de votre pharmacie.
                </p>
              </div>
            </motion.div>
            
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  icon: <Pill className="h-6 w-6" />, 
                  title: "Inventaire", 
                  desc: "Gérez votre stock de médicaments et produits avec précision.",
                  color: "bg-gradient-to-br from-teal-50 to-teal-100",
                  iconBg: "bg-teal-500",
                  delay: 0.2
                },
                { 
                  icon: <Users className="h-6 w-6" />, 
                  title: "Clients", 
                  desc: "Suivez les informations et l'historique de vos patients.",
                  color: "bg-gradient-to-br from-blue-50 to-blue-100",
                  iconBg: "bg-blue-500",
                  delay: 0.4
                },
                { 
                  icon: <Bell className="h-6 w-6" />, 
                  title: "Alertes", 
                  desc: "Recevez des notifications pour les stocks bas et dates d'expiration.",
                  color: "bg-gradient-to-br from-amber-50 to-amber-100",
                  iconBg: "bg-amber-500",
                  delay: 0.6
                },
                { 
                  icon: <Calendar className="h-6 w-6" />, 
                  title: "Calendrier", 
                  desc: "Planifiez vos rendez-vous et événements importants.",
                  color: "bg-gradient-to-br from-purple-50 to-purple-100",
                  iconBg: "bg-purple-500",
                  delay: 0.8
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpVariants}
                  transition={{ delay: feature.delay }}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <div className={`rounded-full ${feature.iconBg} p-2 text-white`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-slate-600 mt-2">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex justify-center mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <Link href="/features">
                <Button size="lg" variant="outline" className="group">
                  Voir toutes les fonctionnalités
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                  Témoignages
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                    Ce que disent nos clients
                  </span>
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Découvrez comment PharmaFlow aide les pharmacies à optimiser leur gestion quotidienne.
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "PharmaFlow a transformé ma gestion quotidienne. Tout est plus fluide et je gagne un temps précieux.",
                  name: "Dr. Sophie Laurent",
                  role: "Pharmacienne, Casablanca",
                  delay: 0.2
                },
                {
                  quote: "L'interface est intuitive et les fonctionnalités d'alerte m'évitent des ruptures de stock coûteuses.",
                  name: "Mehdi Alaoui",
                  role: "Gérant de pharmacie, Rabat",
                  delay: 0.4
                },
                {
                  quote: "Le support client est exceptionnel et le système est fiable. Un vrai plus pour notre équipe.",
                  name: "Amina Benjelloun",
                  role: "Pharmacienne, Marrakech",
                  delay: 0.6
                }
              ].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUpVariants}
                  transition={{ delay: testimonial.delay }}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="inline-block h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 flex-grow mb-4">"{testimonial.quote}"</p>
                    <div className="mt-auto">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                </div>
                </motion.div>
              ))}
              </div>
                </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
              <motion.div 
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Prêt à transformer votre pharmacie ?
                </h2>
                <p className="max-w-[600px] text-white/80 md:text-xl">
                  Rejoignez des centaines de pharmacies qui ont déjà optimisé leur gestion grâce à PharmaFlow.
                </p>
                <ul className="space-y-2">
                  {[
                    "Installation rapide et simple",
                    "Support technique 24/7",
                    "Formation complète incluse",
                    "Migration de données assistée"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="rounded-full bg-white/20 p-1">
                        <Check className="h-4 w-4" />
              </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90 hover:shadow-lg transition-all">
                      Démarrer gratuitement
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-white/40 hover:bg-white/10 hover:border-white transition-all">
                      Contactez-nous
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
              >
                <div className="relative w-full max-w-[500px] mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-indigo-900/70 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xl font-bold mb-2">Essai gratuit</p>
                      <p className="text-4xl font-bold mb-4">30 jours</p>
                      <p className="text-white/80 mb-6">Sans engagement</p>
                      <Link href="/auth/register">
                        <Button className="bg-white text-blue-700 hover:bg-white/90 transition-all">
                          Commencer maintenant
                        </Button>
                      </Link>
                    </div>
                  </div>
              </div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-white/10 blur-2xl animate-pulse"></div>
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-teal-300/10 blur-2xl animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer with Animation */}
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
                <AnimatedLogo size="lg" showText={true} />
              </Link>
              <p className="text-slate-600 max-w-sm mt-4">
                Solution complète de gestion pour les pharmacies modernes. Simplifiez votre quotidien et concentrez-vous sur l'essentiel.
              </p>
              <div className="flex gap-4 mt-6">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <Link key={social} href={`#${social}`} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <span className="sr-only">{social}</span>
                  </Link>
                ))}
              </div>
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
              © 2023 PharmaFlow. Tous droits réservés.
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
