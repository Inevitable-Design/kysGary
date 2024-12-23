import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="relative p-10 bg-card border border-secondary rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center group">
              <ChevronsDownIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary transition-transform group-hover:scale-110 duration-300" />
              <h3 className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">KysGarry</h3>
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-primary/90">Game</h3>
            <div>
              <Link href="/chat" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Join Chat
              </Link>
            </div>
            <div>
              <Link href="/#rules" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Rules
              </Link>
            </div>
            <div>
              <Link href="/#leaderboard" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Leaderboard
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-primary/90">Prize Pool</h3>
            <div>
              <Link href="/#current-pool" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Current Pool
              </Link>
            </div>
            <div>
              <Link href="/#winners" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Past Winners
              </Link>
            </div>
            <div>
              <Link href="/#how-to-win" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                How to Win
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-primary/90">Help</h3>
            <div>
              <Link href="/#faq" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                FAQ
              </Link>
            </div>
            <div>
              <Link href="/support" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Support
              </Link>
            </div>
            <div>
              <Link href="/terms" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Terms
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg text-primary/90">Community</h3>
            <div>
              <Link href="https://twitter.com/kysgarry" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Twitter
              </Link>
            </div>
            <div>
              <Link href="https://discord.gg/kysgarry" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                Discord
              </Link>
            </div>
            <div>
              <Link href="https://github.com/kysgarry" className="opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200">
                GitHub
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mt-8 pt-8 border-t border-secondary">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-sm text-muted-foreground">
              &copy; 2024 KysGarry. All rights reserved.
            </h3>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
