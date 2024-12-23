"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { WalletContextProvider } from "./providers";
import { ThemeProvider } from "@/components/layout/theme-provider";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter, usePathname } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <WalletAuthWrapper>
              <Navbar />
              {children}
            </WalletAuthWrapper>
          </ThemeProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}

function WalletAuthWrapper({ children }: { children: React.ReactNode }) {
  const { authenticate, logout, isAuthenticated } = useAuth();
  const { publicKey, signMessage, connected, connecting, disconnect } = useWallet();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAndAuthenticate = async () => {
      if (connected && await !localStorage.getItem('token') && publicKey) {
        await authenticate(publicKey, signMessage);
        await router.push('/');
      } else if(!connected && localStorage.getItem('token')) {
        await localStorage.removeItem('token')
      }
    };
    checkAndAuthenticate();
  }, [connected, publicKey]);

  useEffect(() => {
    if (!connected && pathname === '/chat') {
      router.push('/');
    }
  }, [connected, pathname, router]);

  return <>{children}</>;
}
