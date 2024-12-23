import { NextRequest, NextResponse } from "next/server";
import { generateNonce } from "@/lib/auth";
import { User } from "@/db/schema";
import connectDB from '../../../../db/index';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const publicKey = req.nextUrl.searchParams.get('publicKey');
    if (!publicKey) {
      return NextResponse.json(
        { error: "Public key is required" },
        { status: 400 }
      );
    }

    const nonce = await generateNonce();
    
    // Find or create user and update nonce
    await User.findOneAndUpdate(
      { publicKey },
      { 
        $set: { nonce },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Nonce generation error:', error);
    return NextResponse.json(
      { error: "Failed to generate nonce" },
      { status: 500 }
    );
  }
}