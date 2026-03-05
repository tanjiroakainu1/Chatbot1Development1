/** Live floating particles — primary background effect, gentle motion. */
const BASE_POSITIONS: Array<{ left: string; top: string; size: number; delay: number; duration: number }> = [
  { left: '10%', top: '12%', size: 4, delay: 0, duration: 14 },
  { left: '22%', top: '8%', size: 3, delay: 2, duration: 18 },
  { left: '35%', top: '25%', size: 5, delay: 1, duration: 16 },
  { left: '48%', top: '5%', size: 3, delay: 4, duration: 20 },
  { left: '62%', top: '18%', size: 4, delay: 0.5, duration: 15 },
  { left: '78%', top: '10%', size: 3, delay: 3, duration: 17 },
  { left: '88%', top: '28%', size: 4, delay: 1.5, duration: 19 },
  { left: '15%', top: '45%', size: 3, delay: 2.5, duration: 16 },
  { left: '28%', top: '55%', size: 5, delay: 0, duration: 21 },
  { left: '42%', top: '48%', size: 3, delay: 5, duration: 14 },
  { left: '55%', top: '62%', size: 4, delay: 1, duration: 18 },
  { left: '72%', top: '52%', size: 3, delay: 3.5, duration: 22 },
  { left: '85%', top: '58%', size: 4, delay: 2, duration: 15 },
  { left: '8%', top: '72%', size: 3, delay: 4, duration: 17 },
  { left: '25%', top: '78%', size: 4, delay: 0.5, duration: 19 },
  { left: '38%', top: '85%', size: 3, delay: 1.5, duration: 16 },
  { left: '52%', top: '75%', size: 5, delay: 3, duration: 20 },
  { left: '68%', top: '82%', size: 3, delay: 2, duration: 14 },
  { left: '82%', top: '72%', size: 4, delay: 4.5, duration: 18 },
  { left: '92%', top: '88%', size: 3, delay: 1, duration: 21 },
  { left: '18%', top: '32%', size: 3, delay: 2, duration: 17 },
  { left: '58%', top: '35%', size: 4, delay: 0, duration: 15 },
  { left: '75%', top: '42%', size: 3, delay: 3, duration: 19 },
  { left: '5%', top: '92%', size: 4, delay: 1.5, duration: 16 },
]

/* Extra positions for a fuller "live" feel */
const EXTRA = [
  { left: '32%', top: '15%', size: 2, delay: 2.2, duration: 18 },
  { left: '68%', top: '38%', size: 3, delay: 0.8, duration: 16 },
  { left: '12%', top: '62%', size: 2, delay: 3.3, duration: 20 },
  { left: '45%', top: '78%', size: 3, delay: 1.1, duration: 14 },
  { left: '79%', top: '65%', size: 2, delay: 4, duration: 19 },
  { left: '3%', top: '42%', size: 3, delay: 0.3, duration: 17 },
  { left: '52%', top: '22%', size: 2, delay: 2.7, duration: 21 },
  { left: '92%', top: '55%', size: 3, delay: 1.8, duration: 15 },
]

const POSITIONS = [...BASE_POSITIONS, ...EXTRA]

export default function FloatingParticles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {POSITIONS.map((p, i) => (
        <span
          key={i}
          className={
            i % 3 === 0
              ? 'particle absolute rounded-full bg-red-500/35'
              : i % 3 === 1
                ? 'particle-slow absolute rounded-full bg-red-400/30'
                : 'particle absolute rounded-full bg-rose-400/30'
          }
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
