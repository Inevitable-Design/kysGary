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
    return NextResponse.json({ prizePool: game.prizePool });
  } catch (error) {
    console.error("Failed to fetch prize pool:", error);
    return NextResponse.json(
      { error: "Failed to fetch prize pool" },
      { status: 500 }
    );
  }
}