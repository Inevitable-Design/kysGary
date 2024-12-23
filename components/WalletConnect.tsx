'use client';

import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useAuth from '@/hooks/useAuth';

const WalletConnect: FC = () => {
  const { publicKey, signMessage, connected } = useWallet();
  const { authenticate, isAuthenticated } = useAuth();

  useEffect(() => {
    if (connected && publicKey && !isAuthenticated) {
      handleAuth();
    }
  }, [connected, publicKey]);

  const handleAuth = async () => {
    if (!publicKey || !signMessage) return;
    try {
      await authenticate(publicKey, signMessage);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton />
      {connected && !isAuthenticated && (
        <button 
          onClick={handleAuth}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Authenticate
        </button>
      )}
    </div>
  );
};

export default WalletConnect;