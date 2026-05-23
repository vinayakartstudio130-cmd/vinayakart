import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Truck, FileCheck, HeartHandshake, Microscope, RefreshCw } from 'lucide-react'

interface TrustCard {
  icon: React.ElementType
  title: string
  description: string
}

const trustCards: TrustCard[] = [
  {
    icon: Shield,
    title: 'Guaranteed Authenticity',
    description: 'Each piece comes with a hand-signed provenance certificate and artisan biography â€” verifying its origin, material, and craft lineage.',
  },
  {
    icon: Microscope,
    title: 'Expert Curation',
    description: 'Our in-house panel of art historians and master craftsmen personally inspect every sculpture before it reaches your collection.',
  },
  {
    icon: FileCheck,
    title: 'Legal Documentation',
    description: 'Full compliance with ASI guidelines. All pieces above 100 years come with age verification reports and legal export clearance.',
  },
  {
    icon: Truck,
    title: 'White-Glove Delivery',
    description: 'Bespoke conservation-grade packaging. Fully insured, temperature-controlled, door-to-door delivery worldwide.',
  },
  {
    icon: HeartHandshake,
    title: 'Collector Concierge',
    description: 'A dedicated relationship manager for every acquisition â€” from first enquiry to installation guidance.',
  },
  {
    icon: RefreshCw,
    title: 'Lifetime Trade-Up',
    description: 'Upgrade your collection with ease. Trade your VinayakArt pieces against higher-value acquisitions at 80% of original price.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25,0.46,0.45,0.94] } },
}

export default function WhyChooseUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#E0EBF4' }}
      aria-label="Why Collectors Choose VinayakArt"
    >
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span className="section-label-dark">Our Promise</span>
          </div>
          <h2
            className="font-display font-light leading-[1.1] max-w-2xl mx-auto"
            style={{
              fontFamily: 'Montserrat Alternates, sans-serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
              color: '#162540',
            }}
          >
            Why Collectors Choose{' '}
            <span className="font-semibold" style={{ color: '#1CB8D2' }}>VinayakArt</span>
          </h2>
        </motion.div>

        {/* Cards 3Ã—2 grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {trustCards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="relative bg-white rounded-xl p-6 md:p-7 overflow-hidden group card-lift shadow-sm"
            >
              {/* Cyan top accent on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-xl"
                style={{ background: '#1CB8D2' }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 flex items-center justify-center mb-5 rounded-lg transition-all duration-300 group-hover:bg-[#1CB8D2]"
                style={{ background: 'rgba(28,184,210,0.1)', border: '1px solid rgba(28,184,210,0.2)' }}
              >
                <card.icon size={18} className="transition-colors duration-300 group-hover:text-white" style={{ color: '#1CB8D2' }} />
              </div>

              <h3
                className="font-display font-semibold mb-3 group-hover:text-[#1CB8D2] transition-colors duration-300"
                style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '1.2rem', color: '#162540' }}
              >
                {card.title}
              </h3>
              <p className="font-sans text-[0.8125rem] leading-relaxed" style={{ color: 'rgba(22,37,64,0.55)' }}>
                {card.description}
              </p>

              {/* Bottom dots */}
              <div className="flex gap-1.5 mt-5">
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ background: d === 0 ? '#1CB8D2' : 'rgba(28,184,210,0.2)' }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

