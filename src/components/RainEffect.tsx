/** Raining drop particles — main background effect. */
const DROP_COUNT = 80
const PARTICLE_COUNT = 40

const drops = Array.from({ length: DROP_COUNT }, (_, i) => ({
  left: `${(i * 4.2 + 1) % 98}%`,
  delay: (i * 0.4) % 10,
  duration: 4 + (i % 5) * 0.6,
  width: 1.5 + (i % 3) * 0.5,
  height: 12 + (i % 4) * 6,
  opacity: 0.25 + (i % 4) * 0.08,
  variant: i % 3,
}))

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${(i * 7 + 3) % 96}%`,
  delay: (i * 0.6) % 8,
  duration: 5 + (i % 3) * 1,
  size: 2 + (i % 3),
  opacity: 0.2 + (i % 3) * 0.1,
  variant: i % 2,
}))

function dropColor(variant: number): string {
  switch (variant) {
    case 0:
      return 'rgba(239, 68, 68, 0.5)'
    case 1:
      return 'rgba(220, 38, 38, 0.45)'
    default:
      return 'rgba(248, 113, 113, 0.4)'
  }
}

export default function RainEffect() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {drops.map((d, i) => (
        <span
          key={`d-${i}`}
          className="rain-drop absolute rounded-full"
          style={{
            left: d.left,
            top: '-30px',
            width: d.width,
            height: d.height,
            backgroundColor: dropColor(d.variant),
            boxShadow: '0 0 6px rgba(239, 68, 68, 0.25)',
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        />
      ))}
      {particles.map((p, i) => (
        <span
          key={`p-${i}`}
          className="rain-drop absolute rounded-full"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.variant === 0 ? 'rgba(248, 113, 113, 0.5)' : 'rgba(239, 68, 68, 0.45)',
            boxShadow: '0 0 4px rgba(239, 68, 68, 0.2)',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
