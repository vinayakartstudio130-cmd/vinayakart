import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Award, Users, Gem } from 'lucide-react'

const ARTISAN_IMAGE = 'https://images.unsplash.com/photo-1509587584298-0f3620e1a35f?w=800&q=85&fit=crop'

const highlights = [
  {
    icon: Award,
    title: 'National Award Recipients',
    desc: 'Several of our artisan families carry the Government of India National Award for traditional craft excellence.',
  },
  {
    icon: Users,
    title: '60+ Artisan Families',
    desc: 'A curated collective of master craftsmen from Nashik, Kolhapur, Pandharpur, and Pune.',
  },
  {
    icon: Gem,
    title: 'Collector-Certified Pieces',
    desc: 'Every sculpture comes with a provenance certificate, artisan biography, and authenticity documentation.',
  },
]

export default function ArtisanStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  return (
    <section
      id="artisan"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#162540' }}
      aria-label="Artisan Story"
    >
      <div className="section-container" ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.25,0.46,0.45,0.94] }}
          >
            <div
              ref={imageRef}
              className="relative overflow-hidden rounded-xl"
              style={{ border: '2px solid rgba(28,184,210,0.25)' }}
            >
              <motion.img
                src={ARTISAN_IMAGE}
                alt="Master artisan at work in Maharashtra"
                className="w-full aspect-[4/5] object-cover"
                style={{ y: imageY, filter: 'brightness(0.8) contrast(1.05)' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#162540]/70 via-transparent to-transparent" />
            </div>

            {/* Floating quote card */}
            <motion.div
              className="absolute -bottom-6 -right-4 md:-right-8 max-w-[270px] p-5 z-10 rounded-lg"
              style={{
                background: 'rgba(28,48,80,0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(28,184,210,0.3)',
                borderLeft: '4px solid #1CB8D2',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <p className="font-display italic text-white/85 mb-3 leading-relaxed" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>
                "Every chisel mark is a prayer. We do not make idols — we reveal them."
              </p>
              <p className="font-sans text-[10px] tracking-[0.18em] uppercase" style={{ color: '#1CB8D2' }}>
                — Ganesh Shilpkar, Nashik
              </p>
            </motion.div>
          </motion.div>

          {/* Right — text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25,0.46,0.45,0.94] }}
          >
            <div className="section-label mb-6">The Makers Behind the Art</div>

            <h2
              className="font-display font-light text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.0rem, 4vw, 3.2rem)' }}
            >
              Crafted by{' '}
              <span className="font-semibold" style={{ color: '#1CB8D2' }}>Master Artisans</span>
            </h2>

            <p className="font-sans leading-relaxed mb-5" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)' }}>
              For over two decades, VinayakArt has been the trusted bridge between Maharashtra's
              most gifted hereditary sculptors and collectors who understand the profound value
              of genuine traditional craft.
            </p>

            <p className="font-sans leading-relaxed mb-10" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.45)' }}>
              From the Shilpkar families of Nashik to the brass-casting guilds of Kolhapur —
              our artisans carry techniques passed down across 12 to 20 generations,
              untouched by industrialisation.
            </p>

            <div className="divider-cyan mb-10" />

            <div className="space-y-6">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                >
                  <div
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg"
                    style={{ background: 'rgba(28,184,210,0.12)', border: '1px solid rgba(28,184,210,0.25)' }}
                  >
                    <item.icon size={16} style={{ color: '#1CB8D2' }} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-white mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>
                      {item.title}
                    </h4>
                    <p className="font-sans text-[0.8125rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
