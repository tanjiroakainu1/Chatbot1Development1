# Chatbot Raminder Jangao

AI chatbot (Gemini) with red theme, raining particles, and profile image support.

## Chatbot profile image

To use your own chatbot profile image (e.g. from Downloads):

1. Copy your image into the project as **`public/chatbot-profile.png`** or **`public/chatbot-profile.jpg`**.
2. Example: copy `chatbot1.jpg` from Downloads → `public/chatbot-profile.jpg`.

The app uses this image in the header and next to assistant messages. If no image is found, a default icon is shown.

## Setup

- `npm install`
- Add `VITE_GEMINI_API_KEY` to `.env` (see `.env.example`)
- `npm run dev` to start; `npm run build` to build.

## Vercel deployment

- In the Vercel project: **Settings → Environment Variables** add:
  - **Name:** `VITE_GEMINI_API_KEY`
  - **Value:** your Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))
- Redeploy after adding the variable so the chatbot can call the Gemini API.
