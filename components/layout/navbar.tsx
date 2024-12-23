"use client";
import { ChevronsDown, Github, Menu } from "lucide-react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";
import WalletConnect from "../WalletConnect";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn } from "@/lib/utils";

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

const routeList: RouteProps[] = [
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#team",
    label: "Team",
  },
  {
    href: "#contact",
    label: "Contact",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

const featureList: FeatureProps[] = [
  {
    title: "Showcase Your Value ",
    description: "Highlight how your product solves user problems.",
  },
  {
    title: "Build Trust",
    description:
      "Leverages social proof elements to establish trust and credibility.",
  },
  {
    title: "Capture Leads",
    description:
      "Make your lead capture form visually appealing and strategically.",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const isOnChatPage = pathname === "/chat";
  const { connected } = useWallet();
  const router = useRouter();

  return (
    <header className="shadow-inner bg-opacity-15 w-[95%] md:w-[85%] lg:w-[90%] lg:max-w-screen-2xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        KysGarry
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent 
            side="right" 
            className="w-[300px] sm:w-[400px] p-6 bg-background/95 backdrop-blur-md"
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="mb-8">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
                    <span className="text-xl font-semibold">KysGarry</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 space-y-6">
                {!isOnChatPage && (
                  <div className="space-y-4">
                    {!connected ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 blur-lg" />
                        <p className="relative w-full text-center py-6 text-muted-foreground/80 bg-background/50 border border-border rounded-xl">
                          Connect wallet to start chat
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/chat');
                        }}
                        className="w-full bg-background hover:bg-muted/50 text-foreground hover:text-foreground/90 border border-border hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl py-6"
                      >
                        Start Chat
                      </Button>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative w-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 blur-lg" />
                    <div className="relative flex justify-center">
                      <WalletConnect className="!w-full [&>button]:w-full [&>button]:justify-center [&>button]:py-6 [&>button]:px-4 [&>button]:rounded-xl [&>button]:border [&>button]:border-border [&>button]:bg-background/50 [&>button]:hover:bg-muted/50 [&>button]:shadow-sm [&>button]:hover:shadow-md [&>button]:transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <ToggleTheme />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* <!-- Desktop --> */}
      {/* <NavigationMenu className="hidden lg:block mx-auto"> */}
        {/* <NavigationMenuList> */}
          {/* <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-card text-base">
              Features
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] grid-cols-2 gap-5 p-4">
                <Image
                  src="https://avatars.githubusercontent.com/u/75042455?v=4"
                  alt="RadixLogo"
                  className="h-full w-full rounded-md object-cover"
                  width={600}
                  height={600}
                />
                <ul className="flex flex-col gap-2">
                  {featureList.map(({ title, description }) => (
                    <li
                      key={title}
                      className="rounded-md p-3 text-sm hover:bg-muted"
                    >
                      <p className="mb-1 font-semibold leading-none text-foreground">
                        {title}
                      </p>
                      <p className="line-clamp-2 text-muted-foreground">
                        {description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          {/* <NavigationMenuItem>
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}



      <div className="hidden lg:flex items-center gap-6">
        <ToggleTheme />
        {!isOnChatPage && connected ? (
          <Link href="/chat">
            <Button
              className={cn(
                "relative group px-4 py-2 overflow-hidden transition-all duration-300",
                "bg-transparent hover:bg-transparent border border-primary/20 hover:border-primary/40",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-primary/5 before:to-transparent",
                "before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300",
                "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-primary/10 after:to-primary/5",
                "after:translate-x-100 hover:after:translate-x-0 after:transition-transform after:duration-300"
              )}
            >
              <span className="relative z-10 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-medium">
                Start Chat
              </span>
            </Button>
          </Link>
        ) : !connected && !isOnChatPage ? (
          <p className="text-sm text-muted-foreground">Connect wallet to start chat</p>
        ) : null}
        <WalletConnect/>

      </div>
    </header>
  );
};
