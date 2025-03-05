
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SalesforceTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const { toast } = useToast();

  const testSalesforceAuth = async () => {
    setIsLoading(true);
    try {
      
      const response = await fetch('/api/salesforce/auth');

      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }

      const data = await response.json();

      if (data.authUrl) {
        
        setDebugInfo(data.authUrl);
        console.log('Salesforce Auth URL:', data.authUrl);

        
        window.open(data.authUrl, '_blank');

        toast({
          title: 'Salesforce Auth Initiated',
          description:
            'Complete the login process quickly in the new tab (codes expire in minutes)',
        });
      } else {
        throw new Error('No auth URL returned');
      }
    } catch (error) {
      console.error('Salesforce auth test error:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description:
          error.message || 'Failed to initiate Salesforce authentication',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={testSalesforceAuth}
        disabled={isLoading}
        variant="secondary"
        size="sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing Auth...
          </>
        ) : (
          'Test Salesforce Auth'
        )}
      </Button>
      {debugInfo && (
        <div className="absolute top-9 w-[20rem] left-0 text-xs text-muted-foreground">
          Auth URL generated: Check console for details
        </div>
      )}
    </div>
  );
}
