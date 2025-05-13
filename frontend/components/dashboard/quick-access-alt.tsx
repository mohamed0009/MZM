import Link from "next/link"
import { Activity, Bell, Box, Calendar, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickAccessAlt() {
  const quickLinks = [
    {
      title: "Tableau de bord",
      description: "Visualisez toutes les métriques importantes de votre pharmacie",
      icon: <Activity className="h-10 w-10 text-pharma-primary" />,
      href: "/dashboard",
      color: "from-pharma-primary/20 to-pharma-primary/5",
    },
    {
      title: "Inventaire",
      description: "Gérez votre stock et suivez les niveaux d'inventaire",
      icon: <Box className="h-10 w-10 text-pharma-secondary" />,
      href: "/inventory",
      color: "from-pharma-secondary/20 to-pharma-secondary/5",
    },
    {
      title: "Alertes",
      description: "Consultez les alertes de stock et d'expiration des médicaments",
      icon: <Bell className="h-10 w-10 text-pharma-warning" />,
      href: "/alerts",
      color: "from-pharma-warning/20 to-pharma-warning/5",
    },
    {
      title: "Clients",
      description: "Gérez vos clients et leurs ordonnances",
      icon: <Users className="h-10 w-10 text-pharma-accent" />,
      href: "/clients",
      color: "from-pharma-accent/20 to-pharma-accent/5",
    },
    {
      title: "Calendrier",
      description: "Gérez vos rendez-vous et événements importants",
      icon: <Calendar className="h-10 w-10 text-pharma-info" />,
      href: "/calendar",
      color: "from-blue-400/20 to-blue-400/5",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {quickLinks.map((link, index) => (
        <Link href={link.href} key={index} className="block">
          <Card className="quick-access-card overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full">
            <CardContent className="p-0 h-full">
              <div className={`bg-gradient-to-br ${link.color} p-6 h-full flex flex-col`}>
                <div className="mb-4 rounded-full bg-white/90 w-16 h-16 flex items-center justify-center shadow-md">
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{link.title}</h3>
                <p className="text-sm text-gray-600 mb-6 h-12">{link.description}</p>
                <div className="mt-auto">
                  <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
                    Accéder →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
