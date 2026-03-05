import type { RefObject } from 'react'
import type { ChatMessage } from '@/types/chat'
import MessageBubble from '@/components/MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  messagesEndRef: RefObject<HTMLDivElement>
  isLoading?: boolean
}

export default function MessageList({ messages, messagesEndRef, isLoading = false }: MessageListProps) {
  return (
    <div className="chat-scroll-area min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
      {messages.length === 0 && !isLoading ? (
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/50 text-red-400 shadow-bubble border border-red-800/40 transition hover:scale-105 hover:border-red-600/50">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="max-w-xs text-sm text-slate-400">Say hi or ask anything.</p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="rounded-2xl bg-red-950/50 px-4 py-3 shadow-bubble border border-red-800/40">
                <span className="inline-flex gap-1.5 text-red-300" aria-label="Thinking">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-red-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-red-300" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}
