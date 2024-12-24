import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import "@solana/wallet-adapter-react-ui/styles.css";
import useAuth from "@/hooks/useAuth";

const WalletButton = ({ ...props }) => {
    const { publicKey, wallet, connect, connecting, connected, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [active, setActive] = useState(false);
    const { authenticate, logout, isAuthenticated } = useAuth();
    const ref = useRef<HTMLUListElement>(null);

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (!wallet) {
            return null;
        }
        if (!base58) {
            if (connecting) return "Connecting...";
            if (connected || connecting) return "Connected";
            return "Connect Wallet";
        }
        return base58.slice(0, 4) + "…" + base58.slice(-8);
    }, [wallet, connecting, connected, base58]);

    const copyAddress = useCallback(async () => {
        if (base58) {
            await navigator.clipboard.writeText(base58);
            setCopied(true);
            setTimeout(() => setCopied(false), 400);
        }
    }, [base58]);

    const openDropdown = useCallback(() => setActive(true), [setActive]);
    const closeDropdown = useCallback(() => setActive(false), [setActive]);

    const openModal = useCallback(() => {
        setVisible(true);
        closeDropdown();
    }, [setVisible, closeDropdown]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;
            if (!node || node.contains(event.target as Node)) {
                return;
            }
            closeDropdown();
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, closeDropdown]);

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (event) => {
            if (event.defaultPrevented) return;
            if (!wallet) return openModal();
            if (!base58) return await connect();
            return openDropdown();
        },
        [wallet, base58, connect, openModal, openDropdown]
    );

    const handleDisconnectClick: MouseEventHandler<HTMLLIElement> = useCallback(async (event) => {
        if (event.defaultPrevented) return;
        closeDropdown();
        await disconnect();
        // localStorage.removeItem("token");
    }, [disconnect, closeDropdown])
    return (
        <div className={cn("relative inline-block", props.className)}>
            <button
                aria-expanded={active}
                className={cn(
                    "relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300",
                    "bg-gradient-to-r from-card to-card/90 text-card-foreground",
                    "border border-orange-500/20 rounded-lg",
                    "shadow-[0_0_15px_rgba(251,146,60,0.1)]",
                    "backdrop-blur-md backdrop-filter",
                    "hover:shadow-[0_0_25px_rgba(251,146,60,0.2)] hover:border-orange-500/30 hover:scale-[1.02]",
                    "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-orange-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
                    active ? "pointer-events-none" : "pointer-events-auto"
                )}
                onClick={handleClick}
            >
                <WalletIcon wallet={wallet} className="w-5 h-5 relative z-10" />
                <span className="font-semibold relative z-10">{content || "Select Wallet"}</span>
            </button>
            <ul
                aria-label="dropdown-list"
                className={cn(
                    "absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg",
                    "bg-gradient-to-b from-card to-card/95 border border-orange-500/20",
                    "shadow-lg shadow-orange-500/5 backdrop-blur-md backdrop-filter",
                    "divide-y divide-orange-500/10",
                    active ? "animate-in fade-in-0 zoom-in-95" : "hidden",
                )}
                ref={ref}
                role="menu"
            >
                <li
                    onClick={copyAddress}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-orange-500/10 first:rounded-t-lg transition-colors"
                    role="menuitem"
                >
                    {copied ? "Copied!" : "Copy address"}
                </li>
                <li
                    onClick={openModal}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-orange-500/10 transition-colors"
                    role="menuitem"
                >
                    Change wallet
                </li>
                <li
                    onClick={handleDisconnectClick}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-destructive/20 text-destructive hover:text-destructive last:rounded-b-lg transition-colors"
                    role="menuitem"
                >
                    Disconnect
                </li>
            </ul>
        </div>
    );
};

export default WalletButton;