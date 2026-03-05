/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        chat: {
          bg: '#0f0808',
          bgGradient: '#1a0a0a',
          surface: '#2a1515',
          surfaceMuted: '#3d1c1c',
          border: 'rgba(220, 38, 38, 0.25)',
          borderMuted: 'rgba(220, 38, 38, 0.12)',
          user: '#dc2626',
          userHover: '#ef4444',
          assistant: '#2a1515',
          accent: '#ef4444',
          matrix: '#ff4444',
          matrixDim: 'rgba(180, 50, 50, 0.6)',
        },
      },
      boxShadow: {
        'bubble': '0 2px 12px rgba(0, 0, 0, 0.35)',
        'bubble-user': '0 2px 16px rgba(220, 38, 38, 0.45)',
        'glow': '0 0 32px rgba(220, 38, 38, 0.12)',
        'glow-matrix': '0 0 24px rgba(255, 68, 68, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
