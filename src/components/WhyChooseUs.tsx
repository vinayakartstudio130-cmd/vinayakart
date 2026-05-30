import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Layers, Ruler, Fingerprint, Clock4, SlidersHorizontal, Globe, Focus, PencilLine } from 'lucide-react'

const qualities = [
  {
    icon: Layers,
    title: 'Material Sensibility',
    description: 'Every material is selected for its visual character, depth, and ability to age with elegance.',
  },
  {
    icon: Ruler,
    title: 'Architectural Precision',
    description: 'The studio combines sculptural artistry with structural discipline, resulting in forms that feel both expressive and exact.',
  },
  {
    icon: Fingerprint,
    title: 'Bespoke Approach',
    description: 'No two commissions follow the same process. Every piece is shaped around context, proportion, and spatial identity.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Contemporary Craftsmanship',
    description: 'Traditional attention to detail meets modern execution techniques, creating work that feels timeless rather than trend-driven.',
  },
  {
    icon: Focus,
    title: 'Refined Execution',
    description: 'From concept development to final finish, every stage is approached with precision, restraint, and consistency.',
  },
]

const differentiators = [
  {
    icon: Clock4,
    title: 'Decade of Craft',
    description: 'Over ten years of studio experience across residential, commercial, industrial, and institutional projects. A portfolio that spans scales and sectors.',
  },
  {
    icon: Globe,
    title: 'Global Delivery',
    description: 'Our models travel. Packed with precision, documented with care, we ship to architects, developers, and institutions across continents.',
  },
  {
    icon: Focus,
    title: 'Drawn to Detail',
    description: 'The quality of a model lives in the 1mm decisions — the corner bevel, the rooftop element, the painted facade grain. We take those decisions seriously.',
  },
  {
    icon: PencilLine,
    title: 'Custom at Core',
    description: 'Everything we build is custom. We don\'t work from stock. We work from your brief.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
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
      style={{ background: '#FAF7F2' }}
      aria-label="Why Vinayak Art Studio"
    >
      <div className="section-container" ref={ref}>

        {/* --- Defined by Detail --- */}
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span className="section-label-dark">Our Promise</span>
          </div>
          <h2
            className="font-display font-light leading-[1.1] max-w-2xl mx-auto"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#1C1200' }}
          >
            Defined by{' '}
            <span className="font-semibold" style={{ color: '#D4AF37' }}>Detail</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-20 md:mb-24"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {qualities.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="relative rounded-xl p-6 md:p-7 overflow-hidden group card-lift"
              style={{ background: '#6B0000' }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-xl"
                style={{ background: '#D4AF37' }}
              />
              <div
                className="w-11 h-11 flex items-center justify-center mb-5 rounded-lg transition-all duration-300 group-hover:bg-[#D4AF37]"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <card.icon size={18} className="transition-colors duration-300 group-hover:text-white" style={{ color: '#D4AF37' }} />
              </div>
              <h3
                className="font-display font-semibold mb-3 group-hover:text-[#D4AF37] transition-colors duration-300"
                style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '1.2rem', color: '#FFFFFF' }}
              >
                {card.title}
              </h3>
              <p className="font-sans text-[0.8125rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* --- We Stand Out --- */}
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h2
            className="font-display font-light leading-[1.1] max-w-2xl mx-auto"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#1C1200' }}
          >
            We{' '}
            <span className="font-semibold" style={{ color: '#D4AF37' }}>Stand Out</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {differentiators.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className="relative rounded-xl p-6 overflow-hidden group card-lift"
              style={{ background: '#1C1200', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-xl"
                style={{ background: '#D4AF37' }}
              />
              <div
                className="w-10 h-10 flex items-center justify-center mb-4 rounded-lg"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <card.icon size={16} style={{ color: '#D4AF37' }} />
              </div>
              <h3
                className="font-display font-semibold mb-2 text-white"
                style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '1.05rem' }}
              >
                {card.title}
              </h3>
              <p className="font-sans text-[0.8125rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
