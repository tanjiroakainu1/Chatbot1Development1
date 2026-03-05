interface FloatingAboutChoiceProps {
  onAsk: (question: string) => void
  disabled?: boolean
}

const CHOICES = [
  'Who is the developer?',
  'What services do they offer?',
] as const

export default function FloatingAboutChoice({ onAsk, disabled = false }: FloatingAboutChoiceProps) {
  return (
    <div className="fixed bottom-24 left-4 z-30 flex flex-col gap-2 sm:bottom-28 sm:left-5">
      {CHOICES.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onAsk(label)}
          disabled={disabled}
          className="rounded-xl border border-red-800/50 bg-black/80 px-3 py-2.5 text-left text-xs font-medium text-red-200 shadow-lg backdrop-blur-sm transition hover:border-red-500/60 hover:bg-red-950/70 hover:text-red-100 disabled:opacity-50 disabled:hover:bg-black/80 sm:px-4 sm:py-3 sm:text-sm"
          aria-label={`Ask: ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
