import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

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
    quote: "When the Ganesha arrived, I was moved to tears. The craftsmanship surpasses anything I have seen in twenty years of collecting Indian antiquities.",
    name: 'Priya Raghunathan',
    role: 'Private Collector',
    location: 'Mumbai',
    avatar: '/images/gallery/swami samarth.jpeg',
    rating: 5,
    piece: 'Black Basalt Ganesha',
  },
  {
    id: 2,
    quote: "VinayakArt's curation standards and provenance documentation are the best in the market â€” comparable to any international auction house.",
    name: 'Arjun Mehta',
    role: 'Gallery Director',
    location: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    rating: 5,
    piece: 'Panchaloha Nataraja',
  },
  {
    id: 3,
    quote: "The care VinayakArt took in acquisition, documentation, and delivery was extraordinary. This is a truly special company.",
    name: 'Dr Sunita Desai',
    role: 'Art Historian',
    location: 'Pune',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80',
    rating: 5,
    piece: 'Peshwa-Era Relief',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(1)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1))
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1))

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#2D0A0A' }}
      aria-label="Client Testimonials"
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
            <span className="section-label">From Our Collectors</span>
          </div>
          <h2
            className="font-display font-light text-white leading-[1.1]"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
          >
            Words of the <span className="font-semibold" style={{ color: '#D4AF37' }}>Discerning</span>
          </h2>
        </motion.div>

        {/* 3 Circular avatars */}
        <motion.div
          className="flex items-end justify-center gap-6 md:gap-10 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-3 transition-all duration-400 focus:outline-none"
              style={{ transform: i === active ? 'scale(1.1)' : 'scale(0.9)', opacity: i === active ? 1 : 0.55 }}
              aria-label={`View testimonial from ${t.name}`}
            >
              <div
                className="relative rounded-full overflow-hidden transition-all duration-300"
                style={{
                  width: i === active ? '96px' : '72px',
                  height: i === active ? '96px' : '72px',
                  border: i === active ? '3px solid #D4AF37' : '2px solid rgba(212,175,55,0.3)',
                  boxShadow: i === active ? '0 0 0 4px rgba(212,175,55,0.2)' : 'none',
                }}
              >
                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-sans text-[12px] font-semibold tracking-wide" style={{ color: i === active ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }}>
                  {t.name}
                </p>
                <p className="font-sans text-[10px] tracking-[0.1em] uppercase" style={{ color: i === active ? '#D4AF37' : 'rgba(212,175,55,0.4)' }}>
                  {t.role}
                </p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Active testimonial card */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div
            className="p-8 md:p-10 rounded-xl text-center"
            style={{
              background: '#3D1010',
              border: '2px solid rgba(212,175,55,0.2)',
              borderTop: '4px solid #D4AF37',
            }}
          >
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                <Star key={i} size={14} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
              ))}
            </div>

            <blockquote
              className="font-display font-light text-white/90 leading-relaxed mb-6"
              style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}
            >
              "{testimonials[active].quote}"
            </blockquote>

            <div className="flex items-center justify-center gap-2">
              <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-white/40">
                {testimonials[active].location}
              </span>
              <span className="text-white/20">Â·</span>
              <span
                className="font-sans text-[11px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
              >
                {testimonials[active].piece}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-[#D4AF37] transition-colors rounded-full border border-white/10 hover:border-[#D4AF37]/50"
              aria-label="Previous"
            >
              <ChevronLeft size={15} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === active ? '20px' : '6px',
                    height: '6px',
                    background: i === active ? '#D4AF37' : 'rgba(212,175,55,0.25)',
                  }}
                  aria-label={`Go to ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-[#D4AF37] transition-colors rounded-full border border-white/10 hover:border-[#D4AF37]/50"
              aria-label="Next"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

