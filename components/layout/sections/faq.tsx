import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQSection = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">How to Play</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to know about saving KysGary and winning the prize pool
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-lg border p-6">
          <h3 className="text-xl font-semibold">1. Connect & Chat</h3>
          <p className="text-muted-foreground">
            Connect your Solana wallet and join the conversation. Each message requires a small SOL payment that goes into the prize pool.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-6">
          <h3 className="text-xl font-semibold">2. Be Convincing</h3>
          <p className="text-muted-foreground">
            Try to convince KysGary not to jump. If they respond positively to your message, you could win the entire prize pool!
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border p-6">
          <h3 className="text-xl font-semibold">3. Win Big</h3>
          <p className="text-muted-foreground">
            If no one else succeeds within 24 hours of your message, you win the accumulated prize pool. The game continues with a fresh pool.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-lg border p-8">
        <h3 className="text-xl font-semibold mb-4">Important Rules</h3>
        <ul className="space-y-4 text-muted-foreground">
          <li>• Each message costs 0.1 SOL to send</li>
          <li>• Prize pool accumulates until someone wins</li>
          <li>• 24-hour timer resets with each new message</li>
          <li>• Multiple attempts are allowed, but each requires payment</li>
          <li>• Be respectful and supportive in your messages</li>
        </ul>
      </div>
    </section>
  );
};
