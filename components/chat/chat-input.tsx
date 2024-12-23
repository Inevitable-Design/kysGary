import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (content: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="min-h-[50px] max-h-[200px] flex-1 resize-none rounded-xl bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-white/20"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <Button 
        type="submit" 
        size="icon" 
        className="h-[50px] w-[50px] rounded-xl bg-primary hover:bg-primary/90 transition-colors"
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </form>
  )
}