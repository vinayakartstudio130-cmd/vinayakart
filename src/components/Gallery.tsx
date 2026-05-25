import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const images = [
  { src: '/images/gallery/g01.jpg', alt: 'Shivaji Maharaj on Horseback' },
  { src: '/images/gallery/g02.jpg', alt: 'Shivaji Maharaj Seated' },
  { src: '/images/gallery/g03.jpg', alt: 'Shivaji Maharaj Standing' },
  { src: '/images/gallery/g04.jpg', alt: 'Shivaji Maharaj Full Figure' },
  { src: '/images/gallery/g05.jpg', alt: 'Swami Samarth' },
  { src: '/images/gallery/g06.jpg', alt: 'Shivaji Ganesha Bust' },
  { src: '/images/gallery/g07.jpg', alt: 'Vitthal Statue' },
  { src: '/images/gallery/g08.jpg', alt: 'Shiva Gold' },
  { src: '/images/gallery/g09.jpg', alt: 'Dattatreya Brass' },
  { src: '/images/gallery/g10.jpg', alt: 'Vitthal Temple' },
  { src: '/images/gallery/g11.jpg', alt: 'Swami Samarth Banyan' },
  { src: '/images/gallery/g12.jpg', alt: 'Shiva Black Stone' },
  { src: '/images/gallery/g13.jpg', alt: 'Bronze Warrior' },
  { src: '/images/gallery/g14.jpg', alt: 'Bronze Dancer' },
  { src: '/images/gallery/g15.jpg', alt: 'Ganesha Playing' },
  { src: '/images/gallery/g16.jpg', alt: 'Vitthal Pair' },
  { src: '/images/gallery/g17.jpg', alt: 'Baby Ganesha' },
  { src: '/images/gallery/g18.jpg', alt: 'Shivaji Copper Horse' },
  { src: '/images/gallery/g19.jpg', alt: 'Shivaji Gold Horse' },
  { src: '/images/gallery/g20.jpg', alt: 'Bronze Figure' },
]

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="collections"
      className="py-20 md:py-28"
      style={{ background: '#1a0800' }}
      aria-label="Sculpture Gallery"
    >
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span
              className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}
            >
              Handcrafted Masterpieces
            </span>
          </div>
          <h2
            className="font-display font-light text-white leading-tight"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
          >
            Our <span className="font-semibold" style={{ color: '#C9A84C' }}>Gallery</span>
          </h2>
          <p className="mt-4 font-sans text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
            Every piece tells a story — sculpted by masters, steeped in Maharashtra's living heritage.
          </p>
        </motion.div>

        {/* Masonry grid */}
        <motion.div
          className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {images.map((img, i) => (
            <motion.div
              key={img.src}
              className="break-inside-avoid mb-3 md:mb-4 group relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * i }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                style={{ background: 'linear-gradient(to top, rgba(28,8,0,0.85) 0%, transparent 60%)' }}
              >
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-white/90">
                  {img.alt}
                </span>
              </div>
              {/* Gold border on hover */}
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ border: '1px solid rgba(201,168,76,0.4)' }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
