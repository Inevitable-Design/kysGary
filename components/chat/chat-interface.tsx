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
        content: `Welcome! Current fee is ${data.feeUSD} USD (${data.feeSOL.toFixed(4)} SOL)`,
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
        content,
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

      scrollToBottom();
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
            <div 
              key={message.id}
              className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.sender === 'bot' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-blue-600 text-white'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t border-white/10">
        <div className="max-w-3xl mx-auto p-4">
          <div className="max-w-3xl mx-auto p-4">
            <ChatInput
              onSendMessage={(content) => handleSendMessage(content)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}