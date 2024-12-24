import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = '0px';
    element.style.height = (element.scrollHeight) + 'px';
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-background/50 rounded-2xl p-2 mb-5">
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          autoGrow(e.target);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
        className="w-full px-4 py-3 bg-transparent text-sm resize-none max-h-[200px] focus:outline-none focus:ring-0 border-none placeholder:text-muted-foreground/50 pr-12"
        style={{ overflow: 'hidden' }}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="absolute right-4 bottom-4 p-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {disabled ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  )
}