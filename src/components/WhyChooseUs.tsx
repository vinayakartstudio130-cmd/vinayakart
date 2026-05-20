import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Truck, FileCheck, HeartHandshake, Microscope, RefreshCw } from 'lucide-react'

interface TrustCard {
  icon: React.ElementType
  number: string
  title: string
  description: string
}

const trustCards: TrustCard[] = [
  {
    icon: Shield,
    number: '01',
    title: 'Guaranteed Authenticity',
    description: 'Each piece comes with a hand-signed provenance certificate and artisan biography — verifying its origin, material, and craft lineage.',
  },
  {
    icon: Microscope,
    number: '02',
    title: 'Expert Curation',
    description: 'Our in-house panel of art historians and master craftsmen personally inspect every sculpture before it reaches your collection.',
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'Legal Documentation',
    description: 'Full compliance with ASI guidelines. All pieces above 100 years come with age verification reports and legal export clearance.',
  },
  {
    icon: Truck,
    number: '04',
    title: 'White-Glove Delivery',
    description: 'Bespoke conservation-grade packaging designed by our logistics team. Fully insured, temperature-controlled, door-to-door delivery.',
  },
  {
    icon: HeartHandshake,
    number: '05',
    title: 'Collector Concierge',
    description: 'A dedicated relationship manager for every significant acquisition — from first enquiry to installation guidance.',
  },
  {
    icon: RefreshCw,
    number: '06',
    title: 'Lifetime Trade-Up Programme',
    description: 'Upgrade your collection with ease. Trade your VinayakArt pieces against higher-value acquisitions at 80% of original purchase price.',
  },
]

const bottomStats = [
  { number: '12,000+', label: 'Collectors Worldwide' },
  { number: '500+', label: 'Sculptures Available' },
  { number: '25 Years', label: 'Heritage Craftsmanship' },
  { number: '4.9 / 5', label: 'Collector Rating' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#111111' }}
      aria-label="Why Collectors Choose VinayakArt"
    >
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span className="section-label">Our Promise</span>
          </div>
          <h2
            className="font-display font-light text-[#F5F0E8] leading-[1.1] max-w-2xl mx-auto"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            }}
          >
            Why Collectors Choose{' '}
            <em style={{ color: '#C9A84C' }}>VinayakArt</em>
          </h2>
        </motion.div>

        {/* Trust cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {trustCards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="relative p-6 md:p-7 overflow-hidden group card-lift"
              style={{
                background: '#141210',
                border: '1px solid rgba(201,168,76,0.08)',
              }}
            >
              {/* Faded large number background */}
              <span
                className="absolute top-2 right-3 font-display font-bold select-none pointer-events-none leading-none"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(4rem, 8vw, 6rem)',
                  opacity: 0.04,
                  color: '#C9A84C',
                  lineHeight: 1,
                }}
              >
                {card.number}
              </span>

              {/* Gold icon box */}
              <div
                className="w-11 h-11 flex items-center justify-center mb-5"
                style={{
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}
              >
                <card.icon size={18} style={{ color: '#C9A84C' }} />
              </div>

              {/* Gold top accent line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: 'linear-gradient(90deg, #C9A84C, #F0D080)' }}
              />

              <h3
                className="font-display font-medium text-[#F5F0E8] mb-3 group-hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}
              >
                {card.title}
              </h3>
              <p className="font-sans text-[0.8125rem] text-[#F5F0E8]/40 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <div className="divider-gold mb-0" />
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ background: '#0d0d0d', border: '1px solid rgba(201,168,76,0.08)', borderTop: 'none' }}
          >
            {bottomStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center py-6 px-4 text-center ${
                  i < bottomStats.length - 1 ? 'border-r border-[rgba(201,168,76,0.08)]' : ''
                } ${i >= 2 ? 'border-t border-[rgba(201,168,76,0.08)] md:border-t-0' : ''}`}
              >
                <span
                  className="font-display font-semibold mb-1 gold-text"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  }}
                >
                  {stat.number}
                </span>
                <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#F5F0E8]/35">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
