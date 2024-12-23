'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-4',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <Avatar className="border-2 border-primary/20">
        <AvatarImage src={isBot ? '/bot-avatar.png' : '/user-avatar.png'} />
        <AvatarFallback className="bg-primary/10">{isBot ? 'B' : 'U'}</AvatarFallback>
      </Avatar>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'rounded-2xl px-4 py-2.5 max-w-[80%] shadow-sm',
          isBot
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
            : 'bg-primary text-primary-foreground'
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <time className="text-[10px] opacity-50 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </motion.div>
    </motion.div>
  )
}