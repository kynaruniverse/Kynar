import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { WORLD_CONFIG, WORLD_TYPES } from '@constants/worlds'
import { clsx } from 'clsx'

const WORLD_ORDER = [
  WORLD_TYPES.HAVEN,
  WORLD_TYPES.TOOLS,
  WORLD_TYPES.OASIS,
  WORLD_TYPES.NEXUS,
]

const WORLD_KEY_MAP = {
  [WORLD_TYPES.HAVEN]: 'haven_pct',
  [WORLD_TYPES.TOOLS]: 'tools_pct',
  [WORLD_TYPES.OASIS]: 'oasis_pct',
  [WORLD_TYPES.NEXUS]: 'nexus_pct',
}

/**
 * IdentityCard V2
 * A "shareable artifact" — designed to feel like Spotify Wrapped meets a
 * passport stamp. The primary world dominates with a giant glyph and bold
 * typography; the alignment breakdown is demoted to a clean meta-strip.
 *
 * Forwards a ref so html-to-image can capture the DOM node for downloads.
 *
 * Props:
 *  - username, alignment, primaryWorld     → required content
 *  - size: 'sm' | 'md' | 'lg' | 'share'    → 'share' is the export-friendly,
 *                                            poster-sized layout used on the
 *                                            /card/:username page.
 *  - animated: boolean                     → disable for cleaner image capture
 */
const IdentityCard = forwardRef(function IdentityCard(
  { username, alignment, primaryWorld, size = 'lg', animated = true },
  ref
) {
  if (!alignment || !primaryWorld) return null
  const primary = WORLD_CONFIG[primaryWorld]
  if (!primary) return null

  const breakdown = WORLD_ORDER.map((name) => ({
    name,
    config: WORLD_CONFIG[name],
    pct: alignment[WORLD_KEY_MAP[name]] ?? 0,
  })).sort((a, b) => b.pct - a.pct)

  const isShare = size === 'share'
  const dims = clsx(
    'relative w-full mx-auto overflow-hidden text-white',
    isShare
      ? 'max-w-[420px] aspect-[4/5] rounded-[2.25rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.55)]'
      : size === 'sm'
      ? 'max-w-sm p-6 rounded-3xl shadow-2xl'
      : size === 'md'
      ? 'max-w-md p-8 rounded-[2rem] shadow-2xl'
      : 'max-w-md p-10 rounded-[2.5rem] shadow-2xl'
  )

  const MotionWrap = animated ? motion.div : 'div'
  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      }
    : {}

  // Background: a deep saturated wash of the primary world, layered with a
  // radial highlight to give the card depth on any surface.
  const background = `
    radial-gradient(120% 80% at 15% 0%, ${primary.colors.primary}66 0%, transparent 55%),
    radial-gradient(120% 90% at 100% 100%, ${primary.colors.secondary}55 0%, transparent 60%),
    linear-gradient(160deg, #0d0d16 0%, #06060b 60%, ${primary.colors.text}cc 140%)
  `

  return (
    <MotionWrap ref={ref} {...motionProps} className={dims} style={{ background }}>
      {/* Subtle grain / noise texture using inline SVG for export-safety */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Content shell */}
      <div
        className={clsx(
          'relative h-full flex flex-col',
          isShare ? 'p-9' : ''
        )}
      >
        {/* Header strip */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/45">
              World Identity
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
              4worlds.app
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
              Card
            </p>
            <p className="text-[10px] font-bold tracking-[0.3em] text-white/40">
              No. {breakdown[0].pct}
            </p>
          </div>
        </div>

        {/* Hero — primary world dominates */}
        <div
          className={clsx(
            'relative flex-1 flex flex-col justify-center',
            isShare ? 'my-6' : 'my-10'
          )}
        >
          {/* Giant ghost glyph */}
          <div
            aria-hidden
            className="absolute inset-x-0 -top-4 flex items-center justify-center pointer-events-none select-none"
            style={{ fontSize: isShare ? 280 : 220, lineHeight: 1, opacity: 0.08 }}
          >
            {primary.icon}
          </div>

          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/55 mb-3">
              You are
            </p>
            <h2
              className={clsx(
                'font-black tracking-tighter leading-[0.92] text-white',
                isShare ? 'text-[64px]' : 'text-5xl'
              )}
            >
              {primary.name.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h2>
            <p
              className="mt-5 text-base font-semibold leading-snug max-w-[18ch]"
              style={{ color: primary.colors.primary }}
            >
              {primary.tagline}
            </p>
          </div>

          {/* Dominance score — single big stat */}
          <div className="mt-8 flex items-end gap-4">
            <span
              className={clsx(
                'font-black leading-none tabular-nums',
                isShare ? 'text-[88px]' : 'text-7xl'
              )}
              style={{ color: primary.colors.primary }}
            >
              {breakdown[0].pct}
              <span className="text-3xl text-white/40 ml-0.5">%</span>
            </span>
            <span className="pb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 max-w-[10ch] leading-tight">
              Alignment with your world
            </span>
          </div>
        </div>

        {/* Alignment meta-strip */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
              Spectrum
            </p>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/25">
              {breakdown.map((b) => b.pct).join(' / ')}
            </p>
          </div>

          {/* Stacked single-bar spectrum (replaces 4 separate bars) */}
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5">
            {breakdown.map((row) => (
              <div
                key={row.name}
                className="h-full"
                style={{
                  width: `${row.pct}%`,
                  backgroundColor: row.config.colors.primary,
                }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {breakdown.map((row) => (
              <div
                key={row.name}
                className="flex items-center gap-1.5 text-[10px] font-bold text-white/55"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: row.config.colors.primary }}
                />
                {row.config.name}
                <span className="text-white/35 tabular-nums">{row.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-white/10 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/35">
              Explorer
            </p>
            <p className="text-xl font-black text-white leading-tight">
              @{username || 'unclaimed'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/35">
              Issued
            </p>
            <p className="text-xs font-bold text-white/70 tabular-nums">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </MotionWrap>
  )
})

export default IdentityCard
