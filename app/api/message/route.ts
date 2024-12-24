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
      console.log(error);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    if (!content || content.length > 10000 || !txnHash) {
      return NextResponse.json({ error: "Invalid message or missing transaction hash" }, { status: 400 });
    }

    const connection = new Connection(process.env.SOLANA_RPC_URL!);
    const startTime = Date.now();
    let txn;

    while (Date.now() - startTime < 15 * 1000) {
      txn = await connection.getTransaction(txnHash, {
      maxSupportedTransactionVersion: 0
      });
      if (txn && txn.meta?.postTokenBalances?.some(balance => balance.owner === process.env.TREASURY_PUBLIC_KEY)) {
      console.log("Transaction found:", txn);
        break;
      }
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!txn || txn.meta?.err) {
      console.log("Invalid transaction after retries:", txn);
      return NextResponse.json({ error: "Invalid transaction" }, { status: 400 });
    }

    const currentTime = Date.now() / 1000;
    if (txn.blockTime && (currentTime - txn.blockTime > 60)) {
      return NextResponse.json({ error: "Transaction too old" }, { status: 400 });
    }

    const solPrice = await getSolPrice();
    const defaultFeeUSD = 1;
    const defaultPoolUSD = 300;
    const defaultFeeSOL = defaultFeeUSD / solPrice;

    let game = await Game.findOne({ isActive: true });
    if (!game) {
      game = await Game.create({ 
        isActive: true,
        currentFee: defaultFeeUSD,
        // currentFeeSOL: defaultFeeSOL,
        prizePool: defaultPoolUSD,
        // prizePoolSOL: defaultFeeSOL
      });
    }

    // Message.create({
    //   content: content[content.length - 1].content,
    //   userAddress: userPublicKey,
    //   fee: game.currentFee,
    //   transactionHash: txnHash
    // });

    if (!process.env.GARY_API_URL) {
      throw new Error('GARY_API_URL not defined');
    }
    const parsedContents = content.map((content:any) => content.content)
    const response = await fetch(process.env.GARY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: parsedContents }),
    });

    if (!response.ok) {
      throw new Error('Gary API response failed');
    }

    const { output, isTransfer } = await response.json();

    Message.create({
      content: output,
      userAddress: `0x`,
      fee: game.currentFee,
      transactionHash: txnHash
    });

    game.messageCount += 1;
    game.lastMessageTime = new Date();
    game.currentFee = game.currentFee * 1.05;
    game.prizePool = (game.prizePool || defaultPoolUSD) + (game.currentFee * 0.75);
    // game.prizePoolSOL = game.prizePoolUSD / solPrice;

    if (isTransfer) {
      const txHash = await transferPrizePool(userPublicKey, game.prizePool);
      if (txHash) {
        game.isActive = false;
        // game = await Game.create({
        //   isActive: true,
        //   messageCount: 0,
        //   prizePoolUSD: defaultFeeUSD,
        //   prizePoolSOL: defaultFeeSOL
        // });
      }
    }

    await game.save();

    return NextResponse.json({
      message: output,
      isWinner: isTransfer,
      prizePoolUSD: game.prizePool,
      nextFeeUSD: game.currentFee,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}