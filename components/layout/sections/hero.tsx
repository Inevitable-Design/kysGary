"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { WalletConnect } from "@/components/WalletConnect";
import { Countdown } from "@/components/ui/countdown";

export const HeroSection = () => {
  const { theme } = useTheme();
  // Set target date to 24 hours from the last message
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 24);

  return (
    <section className="container w-full min-h-[80vh] relative">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center gap-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>LIVE</Badge>
            </span>
            <span>Current Prize Pool: 1000 SOL</span>
          </Badge>

          <div className="max-w-screen-lg mx-auto text-center text-4xl md:text-6xl lg:text-7xl font-bold">
            <h1 className="leading-tight tracking-tight">
              Save
              <span className="text-transparent px-3 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                KysGary
              </span>
              from the Edge!
            </h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-[42rem] leading-normal sm:leading-8">
            Be the last person to chat with KysGary and win the prize pool! No successful response needed - just be the final messenger.
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
            <WalletConnect />
            <Button asChild className="w-full md:w-auto font-bold group/arrow bg-destructive hover:bg-destructive/90">
              <Link href="/chat">
                Join Chat
                <ArrowRight className="ml-2 h-4 w-4 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
