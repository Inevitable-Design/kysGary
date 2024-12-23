import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: {
    content: string
    sender: 'user' | 'bot'
    timestamp: Date
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot'

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <Avatar>
        <AvatarImage src={isBot ? '/bot-avatar.png' : '/user-avatar.png'} />
        <AvatarFallback>{isBot ? 'B' : 'U'}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'rounded-lg px-4 py-2 max-w-[80%]',
          isBot
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        <p className="text-sm">{message.content}</p>
        <time className="text-xs opacity-50">
          {message.timestamp.toLocaleTimeString()}
        </time>
      </div>
    </div>
  )
}