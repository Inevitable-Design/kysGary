// lib/solana.ts
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { getSolPrice } from './utils';
export async function transferPrizePool(winnerAddress: string, amountUSD: number) {
  try {
    const solPrice = await getSolPrice();
    const amountSOL = amountUSD / solPrice; // Convert USD to SOL

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const fromWallet = new PublicKey(process.env.TREASURY_WALLET!);
    const toWallet = new PublicKey(winnerAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet,
        toPubkey: toWallet,
        lamports: Math.floor(amountSOL * 1e9) // Convert SOL to lamports
      })
    );

    // Treasury wallet signature implementation needed here
    const txHash = await connection.sendTransaction(transaction, [/* treasury wallet */]);
    await connection.confirmTransaction(txHash);
    return txHash;
  } catch (error) {
    console.error('Transfer failed:', error);
    return null;
  }
}