import { useState, useRef, FormEvent } from 'react'

export interface ImageAttachment {
  base64: string
  mimeType: string
}

interface ChatInputProps {
  onSend: (content: string, image?: ImageAttachment) => void
  disabled?: boolean
}

function fileToBase64(file: File): Promise<ImageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const [header, data] = dataUrl.split(',')
      const mimeMatch = header.match(/:(.*);/)
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png'
      resolve({ base64: data ?? '', mimeType })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [attachment, setAttachment] = useState<ImageAttachment | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text && !attachment) return
    if (disabled) return

    const imageToSend = attachment ?? undefined
    onSend(text || 'What is in this image?', imageToSend)
    setInput('')
    setAttachment(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    try {
      const att = await fileToBase64(file)
      setAttachment(att)
      setPreviewUrl(URL.createObjectURL(file))
    } catch {
      setAttachment(null)
      setPreviewUrl(null)
    }
    e.target.value = ''
  }

  const clearAttachment = () => {
    setAttachment(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-red-900/50 bg-black/50 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      {previewUrl && (
        <div className="mx-auto mb-3 flex max-w-2xl items-center gap-2">
          <img
            src={previewUrl}
            alt="Attachment preview"
            className="h-14 w-14 rounded-lg border border-red-800/40 object-cover"
          />
          <span className="text-xs text-slate-400">Photo attached</span>
          <button
            type="button"
            onClick={clearAttachment}
            className="ml-2 rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-red-950/50 hover:text-slate-300"
          >
            Remove
          </button>
        </div>
      )}
      <div className="mx-auto flex w-full max-w-2xl gap-2 min-w-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Attach image"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-red-800/50 bg-red-950/80 text-red-400 transition hover:border-red-600 hover:bg-red-900/40 disabled:opacity-50 sm:h-[46px] sm:min-w-[46px]"
          aria-label="Choose photo"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or ask about the photo..."
          disabled={disabled}
          className="min-w-0 flex-1 rounded-xl border border-red-800/50 bg-red-950/80 px-3 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30 hover:border-red-700/60 disabled:opacity-60 sm:px-4"
          aria-label="Message"
        />
        <button
          type="submit"
          disabled={(!input.trim() && !attachment) || disabled}
          className="flex h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-bubble-user transition hover:scale-105 hover:from-red-500 hover:to-red-700 hover:shadow-glow-matrix focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#0f0808] disabled:opacity-50 disabled:hover:scale-100 sm:h-[46px] sm:min-w-[46px]"
          aria-label="Send message"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  )
}
