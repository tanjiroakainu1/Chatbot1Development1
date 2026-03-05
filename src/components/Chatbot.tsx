import { useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '@/types/chat'
import { sendToGemini } from '@/services/gemini'
import FloatingParticles from '@/components/FloatingParticles'
import RainEffect from '@/components/RainEffect'
import MessageList from '@/components/MessageList'
import ChatInput from '@/components/ChatInput'
import ExtraInfoPanel from '@/components/ExtraInfoPanel'
import FloatingAboutChoice from '@/components/FloatingAboutChoice'
import ChatbotAvatar from '@/components/ChatbotAvatar'

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (content: string, image?: { base64: string; mimeType: string }) => {
    const text = content.trim()
    if (!text && !image) return

    setError(null)
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text || 'What is in this image?',
      timestamp: new Date(),
      ...(image && { imageBase64: image.base64, imageMimeType: image.mimeType }),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const result = await sendToGemini(messages, text || 'What is in this image?', image)
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.text,
        timestamp: new Date(),
        ...(result.image && {
          generatedImageBase64: result.image.base64,
          generatedImageMimeType: result.image.mimeType,
        }),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      const fallbackMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${message}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-safe-area relative flex h-screen w-full max-w-full flex-col overflow-x-hidden bg-gradient-to-b from-[#0f0808] via-[#1a0a0a] to-[#0c0505]">
      <FloatingParticles />
      <RainEffect />
      <div className="relative z-10 flex flex-1 flex-col">
        <header className="shrink-0 border-b border-red-900/50 bg-black/60 px-4 py-3 backdrop-blur-md shadow-glow sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="transition hover:scale-105">
                <ChatbotAvatar size="md" className="block" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-100">Chatbot Raminder Jangao</h1>
                <p className="text-xs text-red-300/90">I'm here to help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className="shrink-0 rounded-xl border border-red-800/50 bg-red-950/60 px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-600/50 hover:bg-red-900/50"
              aria-label="View services and info"
            >
              Info
            </button>
          </div>
        </header>
        <ExtraInfoPanel isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        <FloatingAboutChoice onAsk={(q) => handleSend(q)} disabled={isLoading} />
        {error && (
          <div className="shrink-0 border-b border-amber-500/25 bg-amber-500/10 px-5 py-2.5 text-sm text-amber-300">
            {error}
          </div>
        )}
        <MessageList messages={messages} messagesEndRef={messagesEndRef} isLoading={isLoading} />
        <footer className="shrink-0 border-t border-red-900/50 bg-black/40 px-3 py-2 text-center backdrop-blur-sm sm:px-6">
          <p className="text-xs text-slate-500 break-words">
            Developed by <span className="font-medium text-red-400">Raminder Jangao</span> · Fullstack Developer (Web, App, Game, AI Chatbot)
          </p>
        </footer>
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
