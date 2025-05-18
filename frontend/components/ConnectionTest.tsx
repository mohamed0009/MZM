"use client";

import { useState, useEffect } from "react";
import { useApi } from "../hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle, Loader2, RefreshCw, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function ConnectionTest({ onInitialize }: { onInitialize?: () => void }) {
  const { testConnection } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);
  const [initStatus, setInitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const checkConnection = async () => {
    try {
      setConnectionStatus('loading');
      setIsLoading(true);
      const testResult = await testConnection();
      console.log("Connection test result:", testResult);
      
      if (testResult && testResult.success) {
        setConnectionStatus('connected');
        setResult(testResult.data);
      } else {
        setConnectionStatus('error');
        setError("Failed to connect to backend");
      }
    } catch (error: any) {
      console.error("Connection test error:", error);
      setConnectionStatus('error');
      setError(error.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      setInitStatus('loading');
      // Using direct fetch to initialize data with the correct API endpoint
      const result = await fetch('/api/data/init-sample-data', {
        method: 'POST'
      }).then(res => res.json());
      
      console.log("Data initialization result:", result);
      if (result && result.success) {
        setInitStatus('success');
        if (onInitialize) {
          onInitialize();
        }
      } else {
        setInitStatus('error');
      }
    } catch (error) {
      console.error("Data initialization error:", error);
      setInitStatus('error');
    }
  };

  // Automatically check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Connexion au Serveur Backend
        </CardTitle>
        <CardDescription>
          Vérifiez la connexion avec le serveur de base de données de l'application
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {connectionStatus === 'loading' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
              {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {connectionStatus === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
              {connectionStatus === 'idle' && <AlertCircle className="h-5 w-5 text-amber-600" />}
              
              <div>
                <div className="font-medium">Status de la Connexion</div>
                <div className="text-sm text-slate-500">
                  {connectionStatus === 'loading' && "Test de connexion en cours..."}
                  {connectionStatus === 'connected' && "Connecté au serveur backend"}
                  {connectionStatus === 'error' && "Erreur de connexion au serveur"}
                  {connectionStatus === 'idle' && "Test de connexion non effectué"}
                </div>
              </div>
            </div>
            
            <Badge 
              variant={connectionStatus === 'connected' ? "default" : "outline"}
              className={
                connectionStatus === 'connected' 
                  ? "bg-green-100 text-green-800 hover:bg-green-200 border-0"
                  : connectionStatus === 'error'
                    ? "bg-red-100 text-red-800 hover:bg-red-200 border-0"
                    : connectionStatus === 'loading'
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-0"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200 border-0"
              }
            >
              {connectionStatus === 'connected' && "Connecté"}
              {connectionStatus === 'error' && "Déconnecté"}
              {connectionStatus === 'loading' && "Vérification..."}
              {connectionStatus === 'idle' && "En attente"}
            </Badge>
          </div>
          
          {connectionStatus === 'connected' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Serveur disponible</AlertTitle>
              <AlertDescription className="text-green-700">
                La connexion au serveur backend est établie. L'API est accessible à {result?.message}
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Erreur de connexion</AlertTitle>
              <AlertDescription className="text-red-700">
                Impossible de se connecter au serveur backend. Veuillez vérifier que le serveur est en cours d'exécution sur le port 8081.
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'connected' && (
            <div className="pt-2">
              <div className="mb-2 font-medium text-slate-800">Initialiser les données</div>
              <div className="text-sm text-slate-500 mb-4">
                Remplir la base de données avec des données de démonstration pour l'application (produits, clients, etc.)
              </div>
              
              <Button 
                onClick={initializeData}
                disabled={initStatus === 'loading' || initStatus === 'success'}
                className={
                  initStatus === 'success' 
                    ? "bg-green-600 hover:bg-green-700" 
                    : initStatus === 'error'
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                }
              >
                {initStatus === 'loading' && (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initialisation en cours...
                  </>
                )}
                {initStatus === 'success' && (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Données initialisées
                  </>
                )}
                {initStatus === 'error' && (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Réessayer l'initialisation
                  </>
                )}
                {initStatus === 'idle' && (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Initialiser les données de démo
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t border-slate-100 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          disabled={connectionStatus === 'loading'}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          {connectionStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tester à nouveau
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 