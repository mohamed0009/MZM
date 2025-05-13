"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowRight, Check, CheckCircle, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import api from "@/lib/api"

export default function DataInitPage() {
  const [productCount, setProductCount] = useState(20)
  const [clientCount, setClientCount] = useState(15)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [useMockMode, setUseMockMode] = useState(true)

  const initializeProducts = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      if (useMockMode) {
        // Simulate a delay and successful response
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResult({ 
          success: true, 
          message: `${productCount} produits créés avec succès (mode simulation)` 
        });
      } else {
        const response = await api.post(`/data/init-products?count=${productCount}`)
        setResult({ success: true, message: response.data.message || "Produits créés avec succès" })
      }
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.message || "Erreur lors de la création des produits" 
      })
    } finally {
      setLoading(false)
    }
  }

  const initializeClients = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      if (useMockMode) {
        // Simulate a delay and successful response
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResult({ 
          success: true, 
          message: `${clientCount} clients créés avec succès (mode simulation)` 
        });
      } else {
        const response = await api.post(`/data/init-clients?count=${clientCount}`)
        setResult({ success: true, message: response.data.message || "Clients créés avec succès" })
      }
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.message || "Erreur lors de la création des clients" 
      })
    } finally {
      setLoading(false)
    }
  }

  const initializeAll = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      if (useMockMode) {
        // Simulate a delay and successful response
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResult({ 
          success: true, 
          message: `30 produits et 20 clients créés avec succès (mode simulation)` 
        });
      } else {
        const response = await api.post('/data/init-all')
        setResult({ success: true, message: response.data.message || "Initialisation complète réussie" })
      }
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.message || "Erreur lors de l'initialisation" 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Initialisation des données</h1>
        <div className="flex items-center space-x-2">
          <Switch 
            id="mock-mode" 
            checked={useMockMode}
            onCheckedChange={setUseMockMode}
          />
          <Label htmlFor="mock-mode" className="cursor-pointer">
            Mode simulation {useMockMode ? "(activé)" : "(désactivé)"}
          </Label>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Utilisez cette page pour générer des données d'exemple pour votre base de données.
        {useMockMode && (
          <span className="block mt-2 text-amber-600 text-sm">
            ⚠️ Mode simulation activé : les données ne seront pas réellement stockées dans la base de données.
          </span>
        )}
      </p>

      {result && (
        <Alert className={`mb-6 ${result.success ? "bg-green-50" : "bg-red-50"}`}>
          <div className="flex gap-2">
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTitle>Erreur</AlertTitle>
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Produits</CardTitle>
            <CardDescription>
              Créer des produits pharmaceutiques avec des noms, prix et catégories aléatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="productCount">Nombre de produits</Label>
              <Input
                id="productCount"
                type="number"
                min="1"
                max="100"
                value={productCount}
                onChange={(e) => setProductCount(parseInt(e.target.value))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={initializeProducts} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Initialiser les produits
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Créer des clients avec des noms, coordonnées et historiques médicaux aléatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="clientCount">Nombre de clients</Label>
              <Input
                id="clientCount"
                type="number"
                min="1"
                max="50"
                value={clientCount}
                onChange={(e) => setClientCount(parseInt(e.target.value))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={initializeClients} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Initialiser les clients
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tout initialiser</CardTitle>
            <CardDescription>
              Initialiser toutes les entités en une seule opération
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Cette option va créer:
              <ul className="list-disc list-inside mt-2">
                <li>30 produits pharmaceutiques</li>
                <li>20 clients</li>
              </ul>
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={initializeAll} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Tout initialiser
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="font-semibold mb-2">Notes:</h2>
        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
          <li>Les données générées sont aléatoires et à titre d'exemple uniquement</li>
          <li>Pour éviter les doublons, chaque produit a un code unique</li>
          <li>Les adresses email des clients sont générées à partir de leurs noms</li>
          <li>Cette page est destinée uniquement au développement et devrait être désactivée en production</li>
          <li>Pour utiliser avec une vraie base de données, assurez-vous que le serveur backend est en cours d'exécution et désactivez le mode simulation</li>
        </ul>
      </div>
    </div>
  )
} 