import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const stats = [
  { number: '12,000+', label: 'Collectors Worldwide' },
  { number: '500+', label: 'Unique Sculptures' },
  { number: '25 Yrs', label: 'Heritage Craft' },
  { number: '4.9 â˜…', label: 'Collector Rating' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25,0.46,0.45,0.94] } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero section"
      style={{ background: '#0a0a0a' }}
    >
      {/* Video background */}
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        src="/InShot_20260524_225044074.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(10,8,4,0.55)' }} />

      {/* Wave shape at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#E0EBF4" />
        </svg>
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center section-container pt-32 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overline label */}
        <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <span className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-white px-4 py-1.5 rounded-full" style={{ background: 'rgba(28,184,210,0.85)', border: '1px solid rgba(28,184,210,0.5)' }}>
            Maharashtra's Finest
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-light leading-[1.08] tracking-tight text-white mb-6"
          style={{
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
          }}
        >
          Sculpted in Stone.
          <br />
          <span className="font-semibold" style={{ color: '#FFFFFF' }}>
            Eternal in Spirit.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="font-sans font-light text-white/80 max-w-xl mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.0625rem)' }}
        >
          Collector-grade Maharashtrian sculptures in stone, brass, terracotta and wood â€”
          each piece bearing the soul of a master artisan.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
          <a href="#collections" className="btn-dark">
            Explore Collections
            <ArrowRight size={14} />
          </a>
          <a href="#contact" className="btn-ghost-white">
            Commission a Piece
          </a>
        </motion.div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        className="relative z-20 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ background: '#162540' }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center py-5 px-4 ${
                i < stats.length - 1 ? 'border-r border-white/10' : ''
              } ${i >= 2 ? 'border-t border-white/10 md:border-t-0' : ''}`}
            >
              <span
                className="font-display font-bold mb-1 text-[#1CB8D2]"
                style={{
                  fontFamily: 'Montserrat Alternates, sans-serif',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                }}
              >
                {stat.number}
              </span>
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

