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

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  return (
    <section
      id="artisan"
      className="py-20 md:py-28 bg-[#0d0d0d] overflow-hidden"
      aria-label="Artisan Story"
    >
      <div className="section-container" ref={sectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — image with parallax + floating quote */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              ref={imageRef}
              className="relative overflow-hidden"
              style={{ border: '1px solid rgba(201,168,76,0.12)' }}
            >
              <motion.img
                src={ARTISAN_IMAGE}
                alt="Master artisan at work in Maharashtra"
                className="w-full aspect-[4/5] object-cover"
                style={{ y: imageY, filter: 'brightness(0.75) contrast(1.05)' }}
                loading="lazy"
              />
              {/* Dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 via-transparent to-transparent" />
            </div>

            {/* Floating quote card */}
            <motion.div
              className="absolute -bottom-8 -right-4 md:-right-8 max-w-[280px] p-5 z-10"
              style={{
                background: 'rgba(14,12,10,0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(201,168,76,0.18)',
                borderLeft: '3px solid #C9A84C',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <p
                className="font-display italic text-[#F5F0E8]/85 mb-3 leading-relaxed"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.0625rem' }}
              >
                "Every chisel mark is a prayer. We do not make idols — we reveal them."
              </p>
              <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#C9A84C]">
                — Ganesh Shilpkar, Nashik
              </p>
            </motion.div>

            {/* Decorative gold corner lines */}
            <div className="absolute -top-2 -left-2 w-8 h-8"
              style={{ borderTop: '1.5px solid rgba(201,168,76,0.5)', borderLeft: '1.5px solid rgba(201,168,76,0.5)' }}
            />
            <div className="absolute -top-2 -right-2 w-8 h-8"
              style={{ borderTop: '1.5px solid rgba(201,168,76,0.5)', borderRight: '1.5px solid rgba(201,168,76,0.5)' }}
            />
          </motion.div>

          {/* Right — text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="section-label mb-6">The Makers Behind the Art</div>

            <h2
              className="font-display font-light text-[#F5F0E8] leading-[1.1] mb-6"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(2.0rem, 4vw, 3.2rem)',
              }}
            >
              Crafted by{' '}
              <em style={{ color: '#C9A84C' }}>Master Artisans</em>
            </h2>

            <p className="font-sans text-[#F5F0E8]/55 leading-relaxed mb-5" style={{ fontSize: '0.9375rem' }}>
              For over two decades, VinayakArt has been the trusted bridge between Maharashtra's
              most gifted hereditary sculptors and collectors who understand the profound value
              of genuine traditional craft.
            </p>

            <p className="font-sans text-[#F5F0E8]/45 leading-relaxed mb-10" style={{ fontSize: '0.9375rem' }}>
              From the Shilpkar families of Nashik to the brass-casting guilds of Kolhapur and
              the devotional terracotta tradition of Pandharpur — our artisans carry
              techniques passed down across 12 to 20 generations, untouched by industrialisation.
            </p>

            {/* Thin gold divider */}
            <div className="divider-gold mb-10" />

            {/* Icon highlights */}
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
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    <item.icon size={16} style={{ color: '#C9A84C' }} />
                  </div>
                  <div>
                    <h4
                      className="font-display font-medium text-[#F5F0E8] mb-1"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
                    >
                      {item.title}
                    </h4>
                    <p className="font-sans text-[0.8125rem] text-[#F5F0E8]/40 leading-relaxed">
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
