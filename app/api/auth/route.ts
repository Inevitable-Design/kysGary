// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateNonce, generateToken, verifySignature } from "@/lib/auth";
import { User } from "@/db/schema";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { publicKey, signature, nonce } = await req.json();

    console.log(req.json());

    if (!publicKey || !signature || !nonce) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ publicKey });
    
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        publicKey,
        nonce: await generateNonce(),
        createdAt: new Date(),
      });
      await user.save();
    }

    // Verify nonce
    if (user.nonce !== nonce) {
      return NextResponse.json(
        { error: "Invalid or expired nonce" },
        { status: 401 }
      );
    }

    // Verify signature
    const messageBytes = new TextEncoder().encode(nonce);
    const isValid = verifySignature(messageBytes, signature, publicKey);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Generate new token and update nonce
    const token = generateToken(publicKey);
    user.nonce = await generateNonce(); // Generate new nonce for next auth attempt
    await user.save();

    // Set cookie for additional security
    const cookieStore = cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({ 
      token,
      user: {
        publicKey: user.publicKey,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}