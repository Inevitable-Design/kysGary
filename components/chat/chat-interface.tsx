'use client'

import { useState, useRef, useEffect } from 'react'
import ChatInput from './chat-input'
import ChatMessage from './chat-message'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, newMessage]);
  
    try {
      // Send the message to the API
      const response = await fetch('/api/sendToLLM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch bot response');
      }
  
      const data = await response.json();
  
      // Simulated bot response from the API
      const botResponse: Message = {
        id: Date.now().toString(),
        content: data.reply || 'No response from LLM.',
        sender: 'bot',
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
  
      // Handle error response
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pt-16 px-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t border-white/10">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}