import { motion } from 'framer-motion'
import { WORLD_CONFIG, WORLD_TYPES } from '@constants/worlds'
import { Sparkles } from 'lucide-react'
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
 * IdentityCard
 * The user's "World Identity Card" — designed to be the visual centerpiece
 * of the product. Tunable via props so we can re-use it on profiles, results,
 * and (later) social shares / OG images.
 */
const IdentityCard = ({ username, alignment, primaryWorld, size = 'lg' }) => {
  if (!alignment || !primaryWorld) return null

  const primary = WORLD_CONFIG[primaryWorld]
  if (!primary) return null

  const breakdown = WORLD_ORDER.map((name) => ({
    name,
    config: WORLD_CONFIG[name],
    pct: alignment[WORLD_KEY_MAP[name]] ?? 0,
  })).sort((a, b) => b.pct - a.pct)

  const dims =
    size === 'sm'
      ? 'p-6 rounded-3xl'
      : size === 'md'
      ? 'p-8 rounded-[2rem]'
      : 'p-10 rounded-[2.5rem]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        'relative w-full max-w-md mx-auto overflow-hidden text-white shadow-2xl',
        dims
      )}
      style={{
        background: `linear-gradient(140deg, ${primary.colors.text} 0%, #0b0b14 60%, ${primary.colors.primary}33 130%)`,
      }}
    >
      {/* Ambient orb tinted by primary world */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: primary.colors.primary }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: primary.colors.secondary }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-10">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/60">
          <Sparkles size={12} /> World Identity
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          v1
        </div>
      </div>

      {/* Primary world hero */}
      <div className="relative mb-12">
        <div className="text-5xl mb-4">{primary.icon}</div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">
          You are
        </p>
        <h2 className="text-4xl font-black tracking-tight leading-none mb-3">
          {primary.name}
        </h2>
        <p
          className="text-base font-medium leading-snug"
          style={{ color: primary.colors.primary }}
        >
          {primary.tagline}
        </p>
      </div>

      {/* Alignment breakdown */}
      <div className="relative space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Alignment
        </p>
        {breakdown.map((row, i) => (
          <motion.div
            key={row.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.08, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-1.5 text-sm">
              <div className="flex items-center gap-2 font-bold text-white/90">
                <span className="text-base leading-none">{row.config.icon}</span>
                {row.name}
              </div>
              <span className="font-black tabular-nums text-white">
                {row.pct}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${row.pct}%` }}
                transition={{
                  delay: 0.4 + i * 0.08,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full"
                style={{ backgroundColor: row.config.colors.primary }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer / handle */}
      <div className="relative mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Handle
          </p>
          <p className="text-base font-black text-white">
            @{username || 'unclaimed'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            Worlds
          </p>
          <p className="text-base font-black text-white">4</p>
        </div>
      </div>
    </motion.div>
  )
}

export default IdentityCard
