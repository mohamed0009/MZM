"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertTriangle, Link } from 'lucide-react';
import { checkBackendConnection } from '@/lib/api';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Get the API URL from environment variables
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api');
  }, []);

  const runConnectionTest = async () => {
    setLoading(true);
    try {
      const result = await checkBackendConnection();
      setTestResult(result);
      console.log('Connection test result:', result);
    } catch (error) {
      console.error('Error running test:', error);
      setTestResult({
        isConnected: false,
        message: 'Test failed with an unexpected error',
        error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Your current backend API settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center">
              <span className="font-medium mr-2">API URL:</span>
              <code className="bg-muted px-2 py-1 rounded">{apiUrl}</code>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runConnectionTest} disabled={loading}>
            {loading ? 'Testing Connection...' : 'Test Connection'}
          </Button>
        </CardFooter>
      </Card>

      {testResult && (
        <Card className={`mb-6 ${testResult.isConnected ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResult.isConnected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Connection Successful</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Connection Failed</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResult.isConnected ? (
              <div className="space-y-4">
                <p>{testResult.message}</p>
                {testResult.details && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Response Details:</h3>
                    <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p>{testResult.message}</p>
                {testResult.error && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Error Details:</h3>
                    <pre className="bg-muted p-3 rounded-md overflow-auto text-xs">
                      {JSON.stringify(testResult.error, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testResult.error?.possibleIssue && (
                  <Alert className="bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-600">Troubleshooting</AlertTitle>
                    <AlertDescription>{testResult.error.possibleIssue}</AlertDescription>
                  </Alert>
                )}
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Common Issues:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>Make sure your backend server is running</li>
                    <li>Check if the backend URL is correct</li>
                    <li>Ensure CORS is properly configured on the backend</li>
                    <li>Verify the API endpoints match what your frontend expects</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={runConnectionTest} disabled={loading}>
              {loading ? 'Testing...' : 'Test Again'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={() => window.history.back()}>
          &larr; Back
        </Button>
        <Button variant="outline" asChild>
          <a href="/" className="flex items-center gap-1">
            <Link className="h-4 w-4" />
            Homepage
          </a>
        </Button>
      </div>
    </div>
  );
} 