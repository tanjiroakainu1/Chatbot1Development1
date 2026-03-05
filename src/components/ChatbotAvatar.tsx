import { useState } from 'react'
import { CHATBOT_PROFILE_IMAGES } from '@/constants/app'

interface ChatbotAvatarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

export default function ChatbotAvatar({ className = '', size = 'md' }: ChatbotAvatarProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const sizeClass = sizeClasses[size]
  const useFallback = imageIndex >= CHATBOT_PROFILE_IMAGES.length
  const src = CHATBOT_PROFILE_IMAGES[imageIndex]

  const handleError = () => {
    if (imageIndex + 1 < CHATBOT_PROFILE_IMAGES.length) {
      setImageIndex((i) => i + 1)
    } else {
      setImageIndex(CHATBOT_PROFILE_IMAGES.length)
    }
  }

  if (useFallback) {
    return (
      <div
        className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-xl bg-red-950/80 text-red-400 shadow-glow ${className}`}
        aria-hidden
      >
        <svg className="h-1/2 w-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt="Chatbot profile"
      className={`${sizeClass} shrink-0 rounded-xl object-cover ring-1 ring-red-800/40 ${className}`}
      onError={handleError}
    />
  )
}
