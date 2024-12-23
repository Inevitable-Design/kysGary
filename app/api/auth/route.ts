import { NextRequest, NextResponse } from "next/server";
import { generateNonce, generateToken, verifySignature } from "@/lib/auth";
import { User } from "../../../db/schema";

export async function POST(req: NextRequest) {
  try {
    const { publicKey, signature, nonce } = await req.json();

    const user = await User.findOne({ publicKey });
    if (!user || user.nonce !== nonce) {
      return NextResponse.json({ error: "Invalid nonce" }, { status: 401 });
    }

    const messageBytes = new TextEncoder().encode(nonce);
    const isValid = verifySignature(messageBytes, signature, publicKey);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const token = generateToken(publicKey);
    user.nonce = await generateNonce();
    await user.save();

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
