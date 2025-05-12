"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Attempting direct fetch to backend');
      const response = await fetch('http://localhost:8080/api/test/echo', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Important: don't send credentials
        credentials: 'omit',
        // Increase timeout with AbortController
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetch successful:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test on page load
  useEffect(() => {
    testDirectFetch();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Direct API Test</h1>
      
      <Card className="w-full max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-xl">Backend Connection Test</CardTitle>
          <CardDescription>Testing direct fetch connection to backend API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center p-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <span className="ml-2">Testing connection...</span>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-2 text-xs">
                  Please check that your backend server is running at:
                  <code className="block mt-1 p-2 bg-gray-100 rounded">http://localhost:8080/api</code>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {result && (
            <Alert>
              <AlertTitle>Connection Successful</AlertTitle>
              <AlertDescription>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={testDirectFetch} 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Connection Again'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This page uses the native fetch API instead of axios to test the backend connection.</p>
        <p>Check your browser console for detailed logs.</p>
      </div>
    </div>
  );
} 