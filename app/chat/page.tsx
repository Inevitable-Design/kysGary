// app/chat/page.tsx
import ChatInterface from '@/components/chat/chat-interface'

export default function ChatPage() {
  return (
    <div className="flex min-h-screen mb-16 bg-background">
      <div className="flex flex-col flex-1">
        <ChatInterface />
      </div>
    </div>
  )
}