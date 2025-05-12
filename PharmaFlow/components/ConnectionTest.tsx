"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import axios from "axios";

export function ConnectionTest() {
  const [testEchoStatus, setTestEchoStatus] = useState<"loading" | "success" | "error">("loading");
  const [authStatus, setAuthStatus] = useState<"loading" | "success" | "error">("loading");
  const [inventoryStatus, setInventoryStatus] = useState<"loading" | "success" | "error">("loading");
  const [clientsStatus, setClientsStatus] = useState<"loading" | "success" | "error">("loading");
  const [permissionsStatus, setPermissionsStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const { api, test } = useApi();

  const testEchoEndpoint = async () => {
    setTestEchoStatus("loading");
    try {
      const result = await test.checkConnection();
      if (result.connected) {
        setTestEchoStatus("success");
        return true;
      }
      setTestEchoStatus("error");
      return false;
    } catch (error) {
      setTestEchoStatus("error");
      return false;
    }
  };

  const testAuthEndpoint = async () => {
    setAuthStatus("loading");
    try {
      const response = await api.get("/auth/test", { timeout: 5000 });
      setAuthStatus("success");
      return true;
    } catch (error: unknown) {
      // Even if the endpoint returns a 401 error, it means the API is accessible
      if (axios.isAxiosError(error) && error.response) {
        setAuthStatus("success");
        return true;
      }
      setAuthStatus("error");
      return false;
    }
  };

  const testInventoryEndpoint = async () => {
    setInventoryStatus("loading");
    try {
      const response = await api.get("/inventory/products", { timeout: 5000 });
      setInventoryStatus("success");
      return true;
    } catch (error: unknown) {
      // If 401 or 403, API exists but requires auth
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        setInventoryStatus("success");
        return true;
      }
      setInventoryStatus("error");
      return false;
    }
  };

  const testClientsEndpoint = async () => {
    setClientsStatus("loading");
    try {
      const response = await api.get("/clients", { timeout: 5000 });
      setClientsStatus("success");
      return true;
    } catch (error: unknown) {
      // If 401 or 403, API exists but requires auth
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        setClientsStatus("success");
        return true;
      }
      setClientsStatus("error");
      return false;
    }
  };

  const testPermissionsEndpoint = async () => {
    setPermissionsStatus("loading");
    try {
      const response = await api.get("/permissions/all", { timeout: 5000 });
      setPermissionsStatus("success");
      return true;
    } catch (error: unknown) {
      // If 401 or 403, API exists but requires auth
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        setPermissionsStatus("success");
        return true;
      }
      setPermissionsStatus("error");
      return false;
    }
  };

  const runAllTests = async () => {
    setMessage("");
    const echoResult = await testEchoEndpoint();
    
    if (echoResult) {
      setMessage("Test /test/echo réussi! La connexion de base avec le backend est établie.");
      
      // Continue with other tests
      const authResult = await testAuthEndpoint();
      const inventoryResult = await testInventoryEndpoint();
      const clientsResult = await testClientsEndpoint();
      const permissionsResult = await testPermissionsEndpoint();
      
      if (authResult && inventoryResult && clientsResult && permissionsResult) {
        setMessage("Tous les tests ont réussi! La connexion avec le backend est établie.");
      } else if (authResult || inventoryResult || clientsResult || permissionsResult) {
        setMessage("Test de base réussi, mais certains endpoints ne sont pas accessibles. Le backend est partiellement disponible.");
      }
    } else {
      setMessage("Impossible de se connecter au backend. Vérifiez que le serveur est démarré et accessible.");
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: "loading" | "success" | "error") => {
    if (status === "success") return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === "error") return <XCircle className="h-5 w-5 text-red-500" />;
    return <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-pharma-primary" />;
  };

  return (
    <Card className="w-full max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-xl">Test de connexion avec le backend</CardTitle>
        <CardDescription>Vérification de la connexion avec les différentes API du backend</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
            <span>Test Echo API</span>
            {getStatusIcon(testEchoStatus)}
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
            <span>API d'authentification</span>
            {getStatusIcon(authStatus)}
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
            <span>API d'inventaire</span>
            {getStatusIcon(inventoryStatus)}
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
            <span>API des clients</span>
            {getStatusIcon(clientsStatus)}
          </div>
          <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-md">
            <span>API des permissions</span>
            {getStatusIcon(permissionsStatus)}
          </div>
        </div>

        {message && (
          <Alert variant={message.includes("réussi") ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>État de la connexion</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runAllTests} 
          className="w-full bg-pharma-primary hover:bg-pharma-primary/90"
        >
          Tester à nouveau
        </Button>
      </CardFooter>
    </Card>
  );
} 