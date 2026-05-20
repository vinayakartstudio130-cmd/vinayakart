import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  quote: string
  name: string
  role: string
  location: string
  avatar: string
  rating: number
  piece: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "When the Ganesha arrived, I was moved to tears. The craftsmanship surpasses anything I have seen in twenty years of collecting Indian antiquities. VinayakArt delivered not just a sculpture — they delivered a living tradition.",
    name: 'Priya Raghunathan',
    role: 'Private Collector',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    rating: 5,
    piece: 'Black Basalt Ganesha',
  },
  {
    id: 2,
    quote: "I've sourced Maharashtrian art for my gallery in Singapore for a decade. VinayakArt's curation standards and provenance documentation are the best in the market — comparable to any international auction house.",
    name: 'Arjun Mehta',
    role: 'Gallery Director',
    location: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    rating: 5,
    piece: 'Panchaloha Nataraja',
  },
  {
    id: 3,
    quote: "The Peshwa-era relief panel they found for me had been in one artisan family for four generations. The care VinayakArt took in acquisition, documentation, and delivery was extraordinary. This is a truly special company.",
    name: 'Dr Sunita Desai',
    role: 'Art Historian & Curator',
    location: 'Pune, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    rating: 5,
    piece: 'Peshwa-Era Stone Relief',
  },
  {
    id: 4,
    quote: "My commission for a custom Vitthal idol for our family temple was handled with patience, deep knowledge, and genuine reverence. The artisan communicated throughout the process. I cannot recommend them highly enough.",
    name: 'Vishwas Kulkarni',
    role: 'Temple Trust Chairman',
    location: 'Kolhapur, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    rating: 5,
    piece: 'Commissioned Vitthal Idol',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const prev = () => goTo(current === 0 ? testimonials.length - 1 : current - 1)
  const next = () => goTo(current === testimonials.length - 1 ? 0 : current + 1)

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60,
      transition: { duration: 0.4 },
    }),
  }

  const t = testimonials[current]

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-[#0d0d0d] overflow-hidden"
      aria-label="Client Testimonials"
    >
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span className="section-label">From Our Collectors</span>
          </div>
          <h2
            className="font-display font-light text-[#F5F0E8] leading-[1.1]"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            }}
          >
            Words of the <em style={{ color: '#C9A84C' }}>Discerning</em>
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <motion.div
          className="max-w-3xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Decorative quote mark */}
          <div className="flex justify-center mb-8">
            <Quote
              size={40}
              style={{ color: 'rgba(201,168,76,0.25)', fill: 'rgba(201,168,76,0.08)' }}
            />
          </div>

          {/* Card */}
          <div
            className="relative overflow-hidden p-8 md:p-12"
            style={{
              background: '#141210',
              border: '1px solid rgba(201,168,76,0.12)',
            }}
          >
            {/* Gold top line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, #F0D080, #C9A84C, transparent)' }}
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6 justify-center">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                  ))}
                </div>

                {/* Quote text */}
                <blockquote
                  className="font-display font-light text-[#F5F0E8]/85 text-center leading-relaxed mb-8"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
                  }}
                >
                  "{t.quote}"
                </blockquote>

                {/* Divider */}
                <div className="divider-gold mb-6" />

                {/* Author info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ border: '1.5px solid rgba(201,168,76,0.4)' }}
                  />
                  <div className="text-center md:text-left">
                    <p
                      className="font-display font-medium text-[#F5F0E8]"
                      style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}
                    >
                      {t.name}
                    </p>
                    <p className="font-sans text-[11px] tracking-[0.12em] text-[#F5F0E8]/40">
                      {t.role} &mdash; {t.location}
                    </p>
                  </div>
                  <div
                    className="md:ml-4 px-3 py-1 hidden md:block"
                    style={{
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#C9A84C]">
                      {t.piece}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors"
              style={{ border: '1px solid rgba(201,168,76,0.2)' }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: i === current ? '20px' : '6px',
                    height: '2px',
                    background: i === current
                      ? 'linear-gradient(90deg, #C9A84C, #F0D080)'
                      : 'rgba(201,168,76,0.25)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors"
              style={{ border: '1px solid rgba(201,168,76,0.2)' }}
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
