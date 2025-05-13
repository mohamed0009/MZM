'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { checkBackendConnection } from '@/lib/api';

interface ConnectionError {
  message: string;
  code?: string;
  status?: number;
}

export function ConnectionAlert() {
  const [lastStatus, setLastStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const { isConnected, message, error } = await checkBackendConnection();
      
      // Only show success toast if previously disconnected or first connection
      if (isConnected) {
        if (lastStatus === false || lastStatus === null) {
          toast.success(message, {
            position: 'top-right',
            duration: 3000,
          });
        }
      } else {
        const errorMessage = error?.message || 'Please check if the backend server is running on port 8080';
        toast.error(message, {
          position: 'top-right',
          duration: Infinity,
          description: errorMessage,
        });
      }

      setLastStatus(isConnected);
    };

    // Check connection immediately
    checkConnection();

    // Set up periodic connection check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [lastStatus]);

  return null; // This component doesn't render anything
} 