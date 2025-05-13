"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Settings, Bell, Lock, Users, Database, Globe } from "lucide-react"

interface SettingsDashboardProps {
  data?: any
}

export function SettingsDashboard({ data }: SettingsDashboardProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="mr-2 h-4 w-4" />
            Système
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de votre pharmacie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacy-name">Nom de la Pharmacie</Label>
                <Input id="pharmacy-name" placeholder="Entrez le nom de votre pharmacie" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau Horaire</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="cet">CET (UTC+1)</SelectItem>
                    <SelectItem value="eet">EET (UTC+2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez recevoir les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par email
                  </p>
                </div>
                <Switch checked={data?.notifications?.email} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications push sur votre appareil
                  </p>
                </div>
                <Switch checked={data?.notifications?.push} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par SMS
                  </p>
                </div>
                <Switch checked={data?.notifications?.sms} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Sécurité</CardTitle>
              <CardDescription>
                Gérez les paramètres de sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                  </p>
                </div>
                <Switch checked={data?.security?.twoFactor} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Délai d'expiration de la session (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue={data?.security?.sessionTimeout}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>
                Gérez les utilisateurs et leurs rôles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Utilisateurs Totaux</Label>
                  <p className="text-2xl font-bold">{data?.users?.total}</p>
                </div>
                <div className="space-y-2">
                  <Label>Utilisateurs Actifs</Label>
                  <p className="text-2xl font-bold">{data?.users?.active}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Répartition par Rôle</Label>
                <div className="grid gap-2">
                  {data?.users?.roles.map((role) => (
                    <div key={role.name} className="flex items-center justify-between">
                      <span>{role.name}</span>
                      <span className="font-medium">{role.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations Système</CardTitle>
              <CardDescription>
                Affichez les informations sur votre système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Version du Système</Label>
                <p className="text-sm">{data?.system?.version}</p>
              </div>
              <div className="space-y-2">
                <Label>Dernière Sauvegarde</Label>
                <p className="text-sm">{data?.system?.lastBackup}</p>
              </div>
              <div className="space-y-2">
                <Label>Stockage</Label>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-pharma-primary h-2.5 rounded-full"
                    style={{
                      width: `${(data?.system?.storage.used / data?.system?.storage.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm">
                  {data?.system?.storage.used} GB utilisés sur {data?.system?.storage.total} GB
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 