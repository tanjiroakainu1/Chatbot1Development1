export interface GeminiInlineData {
  mimeType: string
  data: string
}

export type GeminiContentPart =
  | { text: string }
  | { inlineData: GeminiInlineData }

export interface GeminiContent {
  role: 'user' | 'model'
  parts: GeminiContentPart[]
}

export interface GeminiSystemInstruction {
  parts: GeminiContentPart[]
}

export interface GeminiGenerateRequest {
  contents: GeminiContent[]
  systemInstruction?: GeminiSystemInstruction
}

export interface GeminiResponsePart {
  text?: string
  inlineData?: { mimeType?: string; data?: string }
}

export interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiResponsePart[]
    }
  }>
  error?: { message?: string }
}
