import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

export async function transferPrizePool(winnerAddress: string, amount: number) {
  const connection = new Connection(process.env.SOLANA_RPC_URL!);
  const fromWallet = new PublicKey(process.env.TREASURY_WALLET!);
  const toWallet = new PublicKey(winnerAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: toWallet,
      lamports: amount * 1e9 // Convert SOL to lamports
    })
  );

  // Sign and send transaction
  // Note: Implementation details depend on how you manage the treasury wallet
  return await connection.sendTransaction(transaction, [/* treasury wallet */]);
}