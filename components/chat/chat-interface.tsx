"use client"

import { useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import ChatInput from './chat-input'
import axios from 'axios'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface FeeData {
  feeUSD: number
  feeSOL: number
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentFee, setCurrentFee] = useState<FeeData | null>({feeUSD: 0, feeSOL: 0})
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    fetchCurrentFee()
  }, [])

  const fetchCurrentFee = async () => {
    try {
      const response = await axios.get('/api/game/currentFee')
      const data = response.data
      setCurrentFee(data)
      
      // Add initial bot message with fee info
      setMessages([{
        id: '1',
        content: `Welcome! Current fee is ${data.feeUSD} USD `,
        sender: 'bot',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error fetching fee:', error)
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (content: string) => {
    if (!publicKey || !currentFee) return

    setIsLoading(true)
    try {
      // Create transaction
      fetchCurrentFee()
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET_PUBKEY!),
          lamports: Math.floor(currentFee.feeSOL * LAMPORTS_PER_SOL)
        })
      )

      // Send transaction
      const txHash = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(txHash)

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])

      // Send to API
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/message', {
        content: messages,
        txnHash: txHash
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!data) throw new Error('API request failed')

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])

      // Update fee if game state changed
      if (data.nextFeeUSD !== currentFee.feeUSD) {
        setCurrentFee({
          feeUSD: data.nextFeeUSD,
          feeSOL: data.nextFeeSOL
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Transaction failed. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (messages.length) {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] mt-16">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 messages-container">
        <div className="max-w-4xl mx-auto space-y-6 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in-0 slide-in-from-bottom-3`}
            >
              <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted/50 hover:bg-muted/80 transition-colors mr-4'
                } shadow-sm`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                <span className="absolute bottom-1 right-2 text-[10px] opacity-0 group-hover:opacity-50 transition-opacity">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto p-4 md:p-6 pb-6 md:pb-8">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}