import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Game } from "@/db/schema";

export async function GET() {
  try {
    await connectDB();
    const game = await Game.findOne();
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    return NextResponse.json({ currentFee: game.currentFee });
  } catch (error) {
    console.error("Failed to fetch current fee:", error);
    return NextResponse.json(
      { error: "Failed to fetch current fee" },
      { status: 500 }
    );
  }
}
