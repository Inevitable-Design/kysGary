import { create } from 'zustand';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  authenticate: (publicKey: PublicKey, signMessage: any) => Promise<void>;
  logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  authenticate: async (publicKey, signMessage) => {
    try {
      // Get nonce
      const { data: { nonce } } = await axios.get('/api/auth/nonce');
      
      // Sign message
      const message = new TextEncoder().encode(nonce);
      const signature = await signMessage(message);
      
      // Verify signature and get JWT
      const { data: { token } } = await axios.post('/api/auth', {
        publicKey: publicKey.toBase58(),
        signature: bs58.encode(signature),
        nonce
      });
      
      // Store token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ isAuthenticated: true, token });
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    set({ isAuthenticated: false, token: null });
  }
}));

export default useAuth;