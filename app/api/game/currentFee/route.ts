import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Game } from "@/db/schema";
import { getSolPrice } from "@/lib/utils";

export async function GET() {
  try {
    await connectDB();
    const solPrice = await getSolPrice();
    const defaultFeeUSD = 1;
    const defaultFeeSOL = defaultFeeUSD / solPrice;
    
    let game = await Game.findOne({ isActive: true });
    
    if (!game) {
      game = await Game.create({
        isActive: true,
        messageCount: 0,
        currentFee: defaultFeeUSD,
        // currentFeeSOL: defaultFeeSOL,
        prizePool: 300,
        // prizePoolSOL: defaultFeeSOL
      });
    }

    const currentSolFee = game.currentFee / solPrice;

    return NextResponse.json({
      feeUSD: game.currentFee || defaultFeeUSD,
      feeSOL: currentSolFee || defaultFeeSOL
    });
  } catch (error) {
    console.error("Failed to fetch current fee:", error);
    return NextResponse.json(
      { error: "Failed to fetch current fee" },
      { status: 500 }
    );
  }
}