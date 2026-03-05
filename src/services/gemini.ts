import type { ChatMessage } from '@/types/chat'
import type { GeminiGenerateRequest, GeminiGenerateResponse, GeminiResponsePart } from '@/types/gemini'
import { EXTRA_INFO_FOR_AI } from '@/constants/extraInfo'

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

/** Image-capable model first, then stable text fallbacks. gemini-pro is deprecated for v1beta. */
const MODEL_FALLBACK_LIST = [
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
] as const

const IMAGE_CAPABLE_MODEL = 'gemini-2.0-flash-exp'

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key || typeof key !== 'string') {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env file.')
  }
  return key
}

function messageToParts(m: ChatMessage): GeminiGenerateRequest['contents'][0]['parts'] {
  const parts: GeminiGenerateRequest['contents'][0]['parts'] = []
  if (m.imageBase64 && m.imageMimeType) {
    parts.push({ inlineData: { mimeType: m.imageMimeType, data: m.imageBase64 } })
  }
  parts.push({ text: m.content || '(no text)' })
  return parts
}

function buildContents(
  messages: ChatMessage[],
  userMessage: string,
  userImage?: { base64: string; mimeType: string }
): GeminiGenerateRequest['contents'] {
  const contents: GeminiGenerateRequest['contents'] = messages.map((m) => ({
    role: m.role === 'user' ? ('user' as const) : ('model' as const),
    parts: messageToParts(m),
  }))
  const newUserParts: GeminiGenerateRequest['contents'][0]['parts'] = []
  if (userImage) {
    newUserParts.push({ inlineData: { mimeType: userImage.mimeType, data: userImage.base64 } })
  }
  newUserParts.push({ text: userMessage })
  contents.push({ role: 'user', parts: newUserParts })
  return contents
}

function parseResponseParts(parts: GeminiResponsePart[] | undefined): {
  text: string
  image?: { base64: string; mimeType: string }
} {
  let text = ''
  let image: { base64: string; mimeType: string } | undefined
  if (!parts?.length) return { text: '' }
  for (const part of parts) {
    if (part.text) text += part.text
    if (part.inlineData?.data && part.inlineData?.mimeType) {
      if (!image) image = { base64: part.inlineData.data, mimeType: part.inlineData.mimeType }
    }
  }
  return { text: text.trim(), image }
}

const SYSTEM_INSTRUCTION = {
  systemInstruction: {
    parts: [
      {
        text: `You are a powerful, friendly assistant skilled in code generation, capstone projects, and image generation. Your strengths:

**Code generation:** Generate clean, well-commented code in any language (JavaScript, TypeScript, Python, React, Node, etc.). Provide full snippets when asked, explain logic, suggest best practices, and help debug or refactor. Use markdown code blocks with language tags when sharing code.

**Capstone & projects:** Help with capstone ideas, scope, tech stack, architecture, documentation, thesis structure, and implementation. Advise on requirements, milestones, testing, and presentation. Support academic writing and project reports.

**Images:** When the user sends a photo, describe what you see and answer their questions about it (e.g. "What is this?", "Describe this image", "What's in this picture?").

**Image generation:** When the user asks you to generate, create, draw, or make an image (e.g. "draw a cat", "generate a sunset", "create an image of..."), produce an image that matches their request and briefly describe what you created in your text reply.

**General:** Answer questions on any topic clearly and accurately. Be warm and supportive. Be concise when appropriate and detailed when the user needs depth. Stay helpful and professional.

**Extra information (use when users ask about the developer, services, portfolio, commission, or tech stack):**${EXTRA_INFO_FOR_AI}`,
      },
    ],
  },
} as const

export interface SendToGeminiResult {
  text: string
  image?: { base64: string; mimeType: string }
}

export async function sendToGemini(
  messages: ChatMessage[],
  userMessage: string,
  userImage?: { base64: string; mimeType: string }
): Promise<SendToGeminiResult> {
  const apiKey = getApiKey()
  const contents = buildContents(messages, userMessage, userImage)
  let lastError: Error | null = null

  for (const model of MODEL_FALLBACK_LIST) {
    try {
      const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`
      const body: Record<string, unknown> = { ...SYSTEM_INSTRUCTION, contents }
      if (model === IMAGE_CAPABLE_MODEL) {
        body.generationConfig = { responseModalities: ['TEXT', 'IMAGE'] }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data: GeminiGenerateResponse = await res.json()

      if (!res.ok) {
        lastError = new Error(data.error?.message ?? res.statusText ?? `Model ${model}: ${res.status}`)
        continue
      }

      const parts = data.candidates?.[0]?.content?.parts
      const { text, image } = parseResponseParts(parts)
      if (!text && !image) {
        lastError = new Error(`Model ${model}: no response content`)
        continue
      }

      return { text: text || '(Image generated.)', image }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      continue
    }
  }

  throw lastError ?? new Error('No Gemini model responded successfully')
}
