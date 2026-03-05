import type { ReactNode } from 'react'
import { EXTRA_INFO_TEXT } from '@/constants/extraInfo'

const URL_REGEX = /https?:\/\/[^\s]+/g

function parseLines(text: string): ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const parts: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    const re = new RegExp(URL_REGEX.source, 'g')
    while ((match = re.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index))
      }
      parts.push(
        <a
          key={`${i}-${match.index}`}
          href={match[0]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 underline hover:text-red-300"
        >
          {match[0]}
        </a>
      )
      lastIndex = re.lastIndex
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex))
    return (
      <span key={i} className="block">
        {parts.length ? parts : '\u00A0'}
      </span>
    )
  })
}

interface ExtraInfoPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExtraInfoPanel({ isOpen, onClose }: ExtraInfoPanelProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close info"
      />
      <div className="fixed inset-x-4 top-20 bottom-20 z-50 overflow-hidden rounded-2xl border border-red-800/50 bg-red-950/95 shadow-xl sm:inset-x-auto sm:left-1/2 sm:right-auto sm:top-24 sm:bottom-24 sm:w-full sm:max-w-lg sm:-translate-x-1/2">
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-red-800/40 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-100">Services & Info — Raminder Jangao</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-900/50 hover:text-slate-200"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="chat-scroll-area min-h-0 flex-1 overflow-y-auto px-4 py-3 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
            {parseLines(EXTRA_INFO_TEXT)}
          </div>
        </div>
      </div>
    </>
  )
}
