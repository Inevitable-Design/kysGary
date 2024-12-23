import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User } from '@/models/User';
import { sign } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export async function generateNonce() {
  return nacl.randomBytes(32).toString('hex');
}

export function verifySignature(message: Uint8Array, signature: string, publicKey: string) {
  const decodedSignature = bs58.decode(signature);
  const decodedPublicKey = bs58.decode(publicKey);
  
  return nacl.sign.detached.verify(
    message,
    decodedSignature,
    decodedPublicKey
  );
}

export function generateToken(publicKey: string) {
  return jwt.sign({ publicKey }, process.env.JWT_SECRET!, { expiresIn: '24h' });
}

export async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { publicKey: string };
    const user = await User.findOne({ publicKey: decoded.publicKey });
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
}