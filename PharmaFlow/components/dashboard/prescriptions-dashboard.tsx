"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { FileText, Search, Plus, Filter, Calendar, Clock, User, Pill } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrescriptionsDashboardProps {
  data?: {
    total?: number
    pending?: number
    completed?: number
    recent?: Array<{
      id: string
      patient: {
        name: string
        avatar?: string
      }
      doctor: string
      date: string
      status: "pending" | "completed" | "cancelled"
      medications: Array<{
        name: string
        quantity: number
      }>
    }>
  }
}

export function PrescriptionsDashboard({ data }: PrescriptionsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Ordonnances</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.total}</div>
              <p className="text-xs text-muted-foreground">
                Toutes les ordonnances
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.pending}</div>
              <p className="text-xs text-muted-foreground">
                Ordonnances à traiter
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complétées</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.completed}</div>
              <p className="text-xs text-muted-foreground">
                Ordonnances traitées
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ordonnances Récentes</CardTitle>
              <CardDescription>
                Liste des ordonnances récemment ajoutées
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Ordonnance
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recent?.map((prescription) => (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={prescription.patient.avatar} />
                          <AvatarFallback>
                            {prescription.patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{prescription.patient.name}</h4>
                            <Badge
                              variant={
                                prescription.status === "completed"
                                  ? "default"
                                  : prescription.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {prescription.status === "completed"
                                ? "Complétée"
                                : prescription.status === "pending"
                                ? "En attente"
                                : "Annulée"}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            <span>{prescription.doctor}</span>
                            <span className="mx-2">•</span>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{prescription.date}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {prescription.medications.map((med, index) => (
                              <Badge key={index} variant="outline">
                                <Pill className="mr-2 h-3 w-3" />
                                {med.name} ({med.quantity})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 