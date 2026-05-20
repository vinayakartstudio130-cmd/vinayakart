import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=90&fit=crop'

const stats = [
  { number: '12,000+', label: 'Collectors Worldwide' },
  { number: '500+', label: 'Unique Sculptures' },
  { number: '25 Yrs', label: 'Heritage Craftsmanship' },
  { number: '4.9 ★', label: 'Collector Rating' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image with multiple dark overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Ancient Indian heritage architecture at dusk"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Heavy multi-layer dark overlay */}
        <div className="absolute inset-0 bg-[#0a0a0a]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-[#0a0a0a]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/60" />
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-30 grain-overlay" />
      </div>

      {/* Slide counter — right edge */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
        <div className="h-12 w-px bg-gradient-to-b from-transparent to-[#C9A84C]/50" />
        <span className="font-sans text-[10px] tracking-[0.2em] text-[#C9A84C] writing-mode-vertical">
          01 / 03
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-[#C9A84C]/50 to-transparent" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col justify-center section-container pt-28 pb-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overline label */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="section-label">Maharashtra's Finest</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-light leading-[1.05] tracking-tight text-[#F5F0E8] mb-6"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.8rem, 7vw, 7rem)',
          }}
        >
          Sculpted in Stone.
          <br />
          <em className="not-italic" style={{ color: '#C9A84C' }}>
            Eternal in Spirit.
          </em>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="font-sans font-light text-[#F5F0E8]/55 max-w-xl mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.0625rem)' }}
        >
          Collector-grade Maharashtrian sculptures in stone, brass, terracotta and wood —
          each piece bearing the soul of a master artisan and centuries of devotional craft.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16 md:mb-24">
          <a href="#collections" className="btn-gold">
            Explore Collections
            <ArrowRight size={14} />
          </a>
          <a href="#contact" className="btn-ghost-gold">
            Commission a Piece
          </a>
        </motion.div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        {/* Top hairline */}
        <div className="divider-gold" />
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)' }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center py-5 px-4 ${
                i < stats.length - 1 ? 'border-r border-[rgba(201,168,76,0.1)]' : ''
              } ${i >= 2 ? 'border-t border-[rgba(201,168,76,0.1)] md:border-t-0' : ''}`}
            >
              <span
                className="font-display font-semibold mb-1 gold-text"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                }}
              >
                {stat.number}
              </span>
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#F5F0E8]/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#F5F0E8]/30">Scroll</span>
        <div
          className="w-px h-10 relative overflow-hidden"
          style={{ background: 'rgba(201,168,76,0.15)' }}
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-full"
            style={{ background: 'linear-gradient(to bottom, #C9A84C, transparent)' }}
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <ChevronDown size={12} className="text-[#C9A84C]/50" />
      </motion.div>
    </section>
  )
}
