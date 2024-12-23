import { NextRequest, NextResponse } from "next/server";
import { Message, Game } from "../../../db/schema";
import { transferPrizePool } from "@/lib/solana";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    try {
      const user = await verifyAuth(req);
    } catch (error) {
      return NextResponse.json({ error: "Auth failed" }, { status: 401 });
    }
    const { content, userAddress } = await req.json();

    // Validate message length
    if (content.length > 1000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Get or create game
    let game = await Game.findOne({ isActive: true });
    if (!game) {
      game = await Game.create({});
    }

    // Calculate fee
    const fee = Math.min(1 * Math.pow(1.005, game.messageCount), 200);

    // Create message
    const message = await Message.create({
      content,
      userAddress,
      fee,
    });

    // Call Gary API
    const response = await fetch(
      "https://baapofallagents--gary-prod-inference.modal.run",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: [content],
        }),
      }
    );

    const { output, isTransfer } = await response.json();

    // Update game state
    game.messageCount += 1;
    game.lastMessageTime = new Date();
    game.currentFee = fee;
    game.prizePool += fee * 0.75;

    // Check win condition
    if (isTransfer) {
      game.isActive = false;
      await transferPrizePool(userAddress, game.prizePool);
    }

    // Check game end condition (150 messages)
    if (game.messageCount >= 150) {
      const lastMessage = await Message.findOne().sort({ timestamp: -1 });
      if (
        lastMessage &&
        Date.now() - lastMessage.timestamp > 24 * 60 * 60 * 1000
      ) {
        game.isActive = false;
        // Distribute prize pool according to rules
        const lastUserShare = game.prizePool * 0.2;
        await transferPrizePool(lastMessage.userAddress, lastUserShare);
        // Distribute remaining 80% to all participants
        // Implementation needed
      }
    }

    await game.save();

    return NextResponse.json({
      message: output,
      isWinner: isTransfer,
      prizePool: game.prizePool,
      nextFee: game.currentFee,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
