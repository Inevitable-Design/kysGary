import { NextRequest, NextResponse } from "next/server";
import { Message, Game } from "../../../db/schema";
import { transferPrizePool } from "@/lib/solana";
import { verifyToken } from "@/lib/auth";
import { getSolPrice } from "@/lib/utils";
import { Connection } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  try {
    const { txnHash, content } = await req.json();
    
    let userPublicKey: string;
    try {
      const { publicKey } = await verifyToken(req);
      userPublicKey = publicKey;
    } catch (error) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    if (!content || content.length > 10000 || !txnHash) {
      return NextResponse.json({ error: "Invalid message or missing transaction hash" }, { status: 400 });
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const txn = await connection.getTransaction(txnHash);
    
    if (!txn) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 400 });
    }

    const currentTime = Date.now() / 1000;
    if (txn.blockTime && (currentTime - txn.blockTime > 60)) {
      return NextResponse.json({ error: "Transaction too old" }, { status: 400 });
    }

    const solPrice = await getSolPrice();
    const defaultFeeUSD = 300;
    const defaultFeeSOL = defaultFeeUSD / solPrice;

    let game = await Game.findOne({ isActive: true });
    if (!game) {
      game = await Game.create({ 
        isActive: true,
        currentFeeUSD: defaultFeeUSD,
        currentFeeSOL: defaultFeeSOL,
        prizePoolUSD: defaultFeeUSD,
        prizePoolSOL: defaultFeeSOL
      });
    }

    const message = await Message.create({
      content,
      userAddress: userPublicKey,
      feeUSD: defaultFeeUSD,
      feeSOL: defaultFeeSOL,
      transactionHash: txnHash
    });

    if (!process.env.GARY_API_URL) {
      throw new Error('GARY_API_URL not defined');
    }

    const response = await fetch(process.env.GARY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: [content] }),
    });

    if (!response.ok) {
      throw new Error('Gary API response failed');
    }

    const { output, isTransfer } = await response.json();

    game.messageCount += 1;
    game.lastMessageTime = new Date();
    game.currentFeeUSD = defaultFeeUSD;
    game.currentFeeSOL = defaultFeeSOL;
    game.prizePoolUSD = (game.prizePoolUSD || defaultFeeUSD) + (defaultFeeUSD * 0.75);
    game.prizePoolSOL = game.prizePoolUSD / solPrice;

    if (isTransfer) {
      const txHash = await transferPrizePool(userPublicKey, game.prizePoolSOL);
      if (txHash) {
        game.isActive = false;
        game = await Game.create({
          isActive: true,
          messageCount: 0,
          prizePoolUSD: defaultFeeUSD,
          prizePoolSOL: defaultFeeSOL
        });
      }
    }

    await game.save();

    return NextResponse.json({
      message: output,
      isWinner: isTransfer,
      prizePoolUSD: game.prizePoolUSD,
      prizePoolSOL: game.prizePoolSOL,
      nextFeeUSD: game.currentFeeUSD,
      nextFeeSOL: game.currentFeeSOL,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}