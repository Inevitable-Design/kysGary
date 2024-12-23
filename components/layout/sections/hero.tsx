"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import  WalletButton  from "../../../components/WalletConnect";
import { Countdown } from "@/components/ui/countdown";
import { useEffect, useState } from "react";

export const HeroSection = () => {

    const { publicKey, signMessage, connected, connecting, disconnect } = useWallet();
      useEffect(() => {
      // Handle connection state changes
      console.log('Connected:', connected);
      console.log(publicKey?.toBase58());
      if (connected) {
        // toast.success('Wallet connected successfully');
        console.log(publicKey?.toBase58());
      }
    }, [connected]);
    
  const { theme } = useTheme();
  const [prizePool, setPrizePool] = useState<number>(0);
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Fetch prize pool
        const prizePoolRes = await fetch('/api/game/prizePool');
        const prizePoolData = await prizePoolRes.json();
        
        // Fetch last message time
        const lastMessageTimeRes = await fetch('/api/game/lastMessageTime');
        const lastMessageTimeData = await lastMessageTimeRes.json();
        
        setPrizePool(prizePoolData.prizePool);
        
        // Calculate target date (24 hours from last message)
        const lastMessageTime = new Date(lastMessageTimeData.lastMessageTime);
        const targetDate = new Date(lastMessageTime);
        targetDate.setHours(targetDate.getHours() + 24);
        setTargetDate(targetDate);
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch game data:', error);
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative overflow-hidden min-h-screen -mt-20">
      <div className="container mx-auto px-4 lg:max-w-screen-xl">
        <div className="grid place-items-center min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center gap-8 pt-20">
            <Badge variant="outline" className="text-sm py-2">
              <span className="mr-2 text-primary">
                <Badge>LIVE</Badge>
              </span>
              <span>Current Prize Pool: {prizePool} SOL</span>
            </Badge>

            <div className="max-w-screen-lg mx-auto text-center text-4xl md:text-6xl lg:text-7xl font-bold">
              <h1 className="leading-tight tracking-tight">
                Save
                <span className="text-transparent px-3 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                  Gary
                </span>
                from the Edge!
              </h1>
            </div>

            <p className="mt-4 text-lg text-muted-foreground max-w-[42rem] mx-auto text-center">
              Win the prize pool in two ways: Successfully convince KysGary not to jump, or be the last person to chat if no one else messages within 24 hours.
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl font-semibold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                  Time Until Next Winner
                </div>
                <p className="text-sm text-muted-foreground max-w-[30rem]">
                  If no one else messages in this time, the last person to chat wins the prize pool
                </p>
              </div>
              <Countdown targetDate={targetDate} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <WalletButton />
              <Button asChild className="w-full md:w-auto font-bold group/arrow bg-destructive hover:bg-destructive/90">
                <Link href="/chat">
                  Join Chat
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/arrow:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
