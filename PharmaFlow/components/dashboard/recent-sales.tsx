import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EyeIcon, PlusCircle } from "lucide-react"

interface RecentSalesProps {
  data?: {
    id: string
    customer: string
    amount: number
    date: string
  }[]
}

// Default data for when data prop is undefined
const defaultSales = [
  {
    id: "1",
    customer: "Mohammed Alami",
    amount: 450,
    date: "Il y a 3 heures"
  },
  {
    id: "2",
    customer: "Fatima Benali",
    amount: 235,
    date: "Il y a 5 heures"
  },
  {
    id: "3",
    customer: "Youssef Mansouri",
    amount: 899,
    date: "Hier"
  }
]

export function RecentSales({ data }: RecentSalesProps) {
  // Use default data if data prop is undefined
  const salesData = data || defaultSales

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Dernières transactions</h3>
        <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
          <EyeIcon className="h-3 w-3" /> Tout voir
        </Button>
      </div>
      
      <div className="space-y-3">
        {salesData.map((sale) => (
          <div key={sale.id} className="bg-white rounded-lg border p-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={`/abstract-geometric-shapes.png?height=36&width=36&query=${sale.customer}`} alt={sale.customer} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                    {getInitials(sale.customer)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">{sale.customer}</p>
                  <p className="text-sm font-semibold text-emerald-600">+{sale.amount} MAD</p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">{sale.date}</p>
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Payé
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="ghost" className="w-full justify-center border border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50/50">
        <PlusCircle className="mr-1 h-4 w-4" />
        Ajouter une vente
      </Button>
    </div>
  )
}

// Fonction pour obtenir les initiales d'un nom
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
