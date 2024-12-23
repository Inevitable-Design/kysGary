// lib/auth.ts
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import * as jwt from 'jsonwebtoken';
import bs58 from 'bs58';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

// Add type declarations
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    publicKey: string;
  }
}

export const generateNonce = async (): Promise<string> => {
  return crypto.randomBytes(32).toString('base64');
};

export const generateToken = (publicKey: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(
    { publicKey },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifySignature = (
  message: Uint8Array,
  signatureBase58: string,
  publicKeyBase58: string
): boolean => {
  try {
    const signature = bs58.decode(signatureBase58);
    const publicKey = bs58.decode(publicKeyBase58);
    return nacl.sign.detached.verify(message, signature, publicKey);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

export const verifyToken = (req: NextRequest): Promise<{ publicKey: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No bearer token provided');
      }

      const token = authHeader.split(' ')[1];
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { publicKey: string };
      
      if (!decoded || !decoded.publicKey) {
        throw new Error('Invalid token payload');
      }
      
      resolve(decoded);
    } catch (error) {
      reject(error);
    }
  });
};

