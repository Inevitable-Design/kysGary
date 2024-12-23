"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { WalletContextProvider } from "./providers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import useAuth from "@/hooks/useAuth";
import { use, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { authenticate, logout, isAuthenticated } = useAuth();
  const { publicKey, signMessage, connected, connecting, disconnect } = useWallet();

  useEffect(() => {
    const checkAndAuthenticate = async () => {
      if (connected && !localStorage.getItem('token') && publicKey) {
        await authenticate(publicKey, signMessage);
      } else if(!connected && localStorage.getItem('token')) {
        logout();
      }
    };
    checkAndAuthenticate();
  }, [connected, publicKey, authenticate]);

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <WalletContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
