'use client';

import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';

const WalletConnectComponent: FC = () => {
  const { publicKey, signMessage, connected, connecting, disconnect } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle connection state changes
    if (connected) {
      toast.success('Wallet connected successfully');
    }
  }, [connected]);

  const handleAuth = async () => {
    if (!publicKey || !signMessage) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create message for signing
      const message = new TextEncoder().encode(
        `Sign this message for authentication\nTimestamp: ${Date.now()}`
      );
      
      // Request signature
      const signature = await signMessage(message);
      
      // Here you can implement your authentication logic
      // For example, sending the signature to your backend
      console.log('Signature:', signature);
      
      toast.success('Successfully authenticated');
    } catch (error: any) {
      toast.error(error?.message || 'Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to disconnect wallet');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton 
        className="!bg-primary hover:!bg-primary/90" 
      />
      
      {connected && (
        <>
          <button 
            onClick={handleAuth}
            disabled={isLoading}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate'}
          </button>
          
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors"
          >
            Disconnect
          </button>
        </>
      )}
      
      {connecting && (
        <div className="text-muted-foreground">
          Connecting...
        </div>
      )}
    </div>
  );
};

// Use dynamic import to prevent SSR issues
export const WalletConnect = dynamic(
  () => Promise.resolve(WalletConnectComponent),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-primary/20 rounded-md px-4 py-2">
        Loading wallet...
      </div>
    )
  }
);

export default WalletConnect;