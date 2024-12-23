// components/WalletConnect.tsx
'use client';

import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

const WalletConnectComponent: FC = () => {
  const { publicKey, signMessage, connected, connecting, disconnect } = useWallet();
  const { authenticate, logout, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle connection state changes
    if (connected) {
      toast.success('Wallet connected successfully');
    }
  }, [connected]);

  // Handle wallet disconnect
  useEffect(() => {
    if (!connected && isAuthenticated) {
      logout();
      toast.info('Wallet disconnected, logged out');
    }
  }, [connected, isAuthenticated, logout]);

  const handleAuth = async () => {
    if (!publicKey || !signMessage) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    try {
      await authenticate(publicKey, signMessage);
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
      logout();
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to disconnect wallet');
    }
  };

  return (
    <div className="flex items-center gap-4 ">
      <WalletMultiButton 
        className="!bg-primary hover:!bg-primary/90 !h-10 !px-6 !rounded-full !font-medium !text-sm !transition-all !duration-200 !shadow-lg hover:!shadow-primary/25 !border-0 !min-w-[140px] !flex !items-center !justify-center"
      />
      
      {connected && !isAuthenticated && (
        <button 
          onClick={handleAuth}
          disabled={isLoading}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Authenticating...' : 'Authenticate'}
        </button>
      )}

      {connected && isAuthenticated && (
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors"
        >
          Disconnect
        </button>
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