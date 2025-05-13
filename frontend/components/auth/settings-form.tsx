"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      stockAlerts: true,
      expiryAlerts: true,
      orderUpdates: true,
    },
    appearance: {
      theme: "light",
      language: "fr",
      currency: "MAD",
      dateFormat: "dd/MM/yyyy",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      loginNotifications: true,
    },
  })

  const handleNotificationChange = (key: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key as keyof typeof settings.notifications],
      },
    })
  }

  const handleSecurityChange = (key: string) => {
    if (key === "twoFactorAuth") {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          twoFactorAuth: !settings.security.twoFactorAuth,
        },
      })
    } else if (key === "loginNotifications") {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          loginNotifications: !settings.security.loginNotifications,
        },
      })
    }
  }

  const handleAppearanceChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    })
  }

  const handleSecurityValueChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value,
      },
    })
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    setSuccess("")

    try {
      // Simulation d'une mise à jour des paramètres
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("Paramètres mis à jour avec succès")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="appearance">Apparence</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
      </TabsList>

      {success && (
        <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <TabsContent value="notifications">
        <Card className="max-w-2xl mx-auto border-0 shadow-md">
          <CardHeader>
            <CardTitle>Paramètres de notifications</CardTitle>
            <CardDescription>Configurez comment et quand vous souhaitez recevoir des notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Canaux de notification</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleNotificationChange("email")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Notifications du navigateur</Label>
                  <p className="text-sm text-muted-foreground">Recevez des notifications dans votre navigateur</p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={settings.notifications.browser}
                  onCheckedChange={() => handleNotificationChange("browser")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Types de notifications</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stock-alerts">Alertes de stock</Label>
                  <p className="text-sm text-muted-foreground">Notifications lorsque le stock est faible</p>
                </div>
                <Switch
                  id="stock-alerts"
                  checked={settings.notifications.stockAlerts}
                  onCheckedChange={() => handleNotificationChange("stockAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="expiry-alerts">Alertes d'expiration</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour les produits qui vont bientôt expirer
                  </p>
                </div>
                <Switch
                  id="expiry-alerts"
                  checked={settings.notifications.expiryAlerts}
                  onCheckedChange={() => handleNotificationChange("expiryAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="order-updates">Mises à jour des commandes</Label>
                  <p className="text-sm text-muted-foreground">Notifications pour les mises à jour de commandes</p>
                </div>
                <Switch
                  id="order-updates"
                  checked={settings.notifications.orderUpdates}
                  onCheckedChange={() => handleNotificationChange("orderUpdates")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSaveSettings}
              className="ml-auto bg-pharma-primary hover:bg-pharma-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="appearance">
        <Card className="max-w-2xl mx-auto border-0 shadow-md">
          <CardHeader>
            <CardTitle>Paramètres d'apparence</CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application selon vos préférences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => handleAppearanceChange("theme", value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Sélectionnez un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) => handleAppearanceChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                    <SelectItem value="ar">Arabe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={settings.appearance.currency}
                  onValueChange={(value) => handleAppearanceChange("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAD">Dirham marocain (MAD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Format de date</Label>
                <Select
                  value={settings.appearance.dateFormat}
                  onValueChange={(value) => handleAppearanceChange("dateFormat", value)}
                >
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Sélectionnez un format de date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">JJ/MM/AAAA</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/JJ/AAAA</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-JJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSaveSettings}
              className="ml-auto bg-pharma-primary hover:bg-pharma-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card className="max-w-2xl mx-auto border-0 shadow-md">
          <CardHeader>
            <CardTitle>Paramètres de sécurité</CardTitle>
            <CardDescription>Configurez les options de sécurité pour protéger votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoute une couche de sécurité supplémentaire à votre compte
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={() => handleSecurityChange("twoFactorAuth")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Délai d'expiration de session</Label>
                <p className="text-sm text-muted-foreground">Déconnexion automatique après une période d'inactivité</p>
                <Select
                  value={settings.security.sessionTimeout}
                  onValueChange={(value) => handleSecurityValueChange("sessionTimeout", value)}
                >
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Sélectionnez un délai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="never">Jamais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="login-notifications">Notifications de connexion</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez une notification lorsque quelqu'un se connecte à votre compte
                  </p>
                </div>
                <Switch
                  id="login-notifications"
                  checked={settings.security.loginNotifications}
                  onCheckedChange={() => handleSecurityChange("loginNotifications")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Actions de sécurité</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Changer le mot de passe</Button>
                <Button variant="outline">Déconnexion de tous les appareils</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSaveSettings}
              className="ml-auto bg-pharma-primary hover:bg-pharma-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
