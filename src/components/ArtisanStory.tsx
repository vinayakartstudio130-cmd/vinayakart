import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'Each project begins with understanding the space, the context, and the intention behind the piece.',
  },
  {
    number: '02',
    title: 'Material Direction',
    description:
      'Wood, resin, acrylic, textured finishes, metallic surfaces, and layered compositions are selected to enhance the visual and tactile quality of the work.',
  },
  {
    number: '03',
    title: 'Form Development',
    description:
      'Dimensions, structure, silhouette, and detailing are refined through precise drafting and spatial study before execution begins.',
  },
  {
    number: '04',
    title: 'Craft & Finish',
    description:
      'Every piece is shaped through a meticulous balance of technical precision and hand-finished artistry. Textures, lighting integration, depth, and surface refinement are completed with exceptional attention to detail.',
  },
  {
    number: '05',
    title: 'Final Presentation',
    description:
      'Each work is carefully prepared for installation, presentation, or spatial integration with secure handling and refined finishing standards.',
  },
  {
    number: '06',
    title: 'Delivery',
    description: 'Packed with care. Delivered globally. Installed, if required.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function ArtisanStory() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="process"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#162540' }}
      aria-label="Studio Process"
    >
      <div className="section-container" ref={ref}>
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label mb-4">The Making</div>
          <h2
            className="font-display font-light text-white leading-[1.1] mb-3"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
          >
            The Studio{' '}
            <span className="font-semibold" style={{ color: '#D4AF37' }}>Process</span>
          </h2>
          <p className="font-sans text-sm max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Six steps from your brief to the final piece.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              className="relative group rounded-xl p-6 md:p-7 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: '#D4AF37' }}
              />
              <span
                className="font-display font-bold mb-4 block"
                style={{ color: '#D4AF37', fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '2rem', lineHeight: 1 }}
              >
                {step.number}
              </span>
              <h3
                className="font-display font-semibold text-white mb-3"
                style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '1.15rem' }}
              >
                {step.title}
              </h3>
              <p className="font-sans text-[0.8125rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
