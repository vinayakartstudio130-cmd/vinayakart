import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: number
  quote: string
  role: string
  avatar: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: 'The detailing and finish carried a remarkable sense of restraint and sophistication. The piece transformed the entire environment.',
    role: 'Interior Designer',
    avatar: '/images/gallery/swami samarth.jpeg',
    rating: 5,
  },
  {
    id: 2,
    quote: 'The execution reflected exceptional precision. Every proportion, texture, and material choice felt intentional.',
    role: 'Architectural Consultant',
    avatar: '/images/gallery/dattatreya brass statue.jpeg',
    rating: 5,
  },
  {
    id: 3,
    quote: 'A rare balance between craftsmanship and contemporary design language.',
    role: 'Private Client',
    avatar: '/images/gallery/golden shiva statue.jpeg',
    rating: 5,
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
      style={{ background: '#6B0000' }}
      aria-label="Client Testimonials"
    >
      <div className="section-container" ref={ref}>
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span className="section-label">What Our Clients Say</span>
          </div>
          <h2
            className="font-display font-light text-white leading-[1.1]"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
          >
            In Their <span className="font-semibold" style={{ color: '#D4AF37' }}>Words</span>
          </h2>
        </motion.div>

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
              aria-label={`View testimonial ${t.id}`}
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
                <img src={t.avatar} alt={t.role} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="font-sans text-[10px] tracking-[0.1em] uppercase" style={{ color: i === active ? '#D4AF37' : 'rgba(212,175,55,0.4)' }}>
                  {t.role}
                </p>
              </div>
            </button>
          ))}
        </motion.div>

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
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                <Star key={i} size={14} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
              ))}
            </div>

            <blockquote
              className="font-display font-light text-white/90 leading-relaxed mb-6"
              style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}
            >
              &ldquo;{testimonials[active].quote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-center">
              <span
                className="font-sans text-[11px] tracking-[0.14em] uppercase px-3 py-1 rounded-full"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
              >
                {testimonials[active].role}
              </span>
            </div>
          </div>

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
