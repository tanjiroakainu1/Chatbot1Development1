import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'

const components: Components = {
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-red-900/40 bg-slate-900/90 p-3 text-xs leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="rounded border border-red-900/30 bg-slate-800/90 px-1.5 py-0.5 font-mono text-xs text-red-100" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="font-mono text-slate-200" {...props}>
        {children}
      </code>
    )
  },
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-inside list-disc space-y-1 pl-2">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-inside list-decimal space-y-1 pl-2">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
}

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:my-2">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}
