export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  /** User message with photo: base64 data URL or raw base64 */
  imageBase64?: string
  imageMimeType?: string
  /** Assistant message: AI-generated image */
  generatedImageBase64?: string
  generatedImageMimeType?: string
}
