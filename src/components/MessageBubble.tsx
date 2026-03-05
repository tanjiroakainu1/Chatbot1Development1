import { useState } from 'react'
import type { ChatMessage } from '@/types/chat'
import MarkdownContent from '@/components/MarkdownContent'
import ChatbotAvatar from '@/components/ChatbotAvatar'

function formatMessageTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [viewingImage, setViewingImage] = useState(false)
  const imageSrc =
    message.imageBase64 && message.imageMimeType
      ? `data:${message.imageMimeType};base64,${message.imageBase64}`
      : null
  const generatedImageSrc =
    message.generatedImageBase64 && message.generatedImageMimeType
      ? `data:${message.generatedImageMimeType};base64,${message.generatedImageBase64}`
      : null

  return (
    <>
    <div
      className={`flex flex-col gap-1.5 animate-fade-in ${isUser ? 'items-end' : 'items-start'}`}
      role="article"
    >
      <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && <ChatbotAvatar size="sm" />}
        <span className="text-xs font-medium uppercase tracking-wider text-red-400/80">
          {isUser ? 'You' : 'Assistant'}
        </span>
      </div>
      <div
        className={`min-w-0 max-w-[85%] rounded-2xl px-3 py-2.5 shadow-bubble transition hover:scale-[1.02] sm:max-w-[75%] sm:px-4 sm:py-3 ${
          isUser
            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-bubble-user hover:shadow-glow-matrix'
            : 'bg-red-950/60 text-slate-100 border border-red-800/40 hover:border-red-600/50'
        }`}
      >
        {isUser ? (
          <>
            {imageSrc && (
              <button
                type="button"
                onClick={() => setViewingImage(true)}
                className="mb-2 block cursor-pointer rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="View full image"
              >
                <img
                  src={imageSrc}
                  alt="Sent"
                  className="max-h-40 rounded-lg object-contain transition hover:opacity-90"
                />
              </button>
            )}
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
          </>
        ) : (
          <div className="text-sm leading-relaxed">
            {generatedImageSrc && (
              <button
                type="button"
                onClick={() => setViewingImage(true)}
                className="mb-2 block w-full cursor-pointer rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-red-400/50"
                aria-label="View generated image"
              >
                <img
                  src={generatedImageSrc}
                  alt="Generated"
                  className="max-h-64 w-full rounded-lg object-contain transition hover:opacity-90"
                />
              </button>
            )}
            {message.content ? <MarkdownContent content={message.content} /> : null}
          </div>
        )}
      </div>
      <time
        dateTime={new Date(message.timestamp).toISOString()}
        className="text-xs text-slate-500"
      >
        {formatMessageTime(message.timestamp)}
      </time>
    </div>

    {(viewingImage && (imageSrc || generatedImageSrc)) && (
      <button
        type="button"
        onClick={() => setViewingImage(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 focus:outline-none sm:p-4"
        aria-label="Close image view"
      >
        <img
          src={imageSrc ?? generatedImageSrc ?? ''}
          alt="Full size"
          className="max-h-[90vh] max-w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </button>
    )}
    </>
  )
}
