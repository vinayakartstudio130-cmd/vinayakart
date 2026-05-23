import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface Collection {
  id: string
  number: string
  title: string
  subtitle: string
  pieces: number
  image: string
}

const collections: Collection[] = [
  {
    id: 'sacred',
    number: '01',
    title: 'Sacred Idols',
    subtitle: 'Devotional Sculptures',
    pieces: 84,
    image: 'https://images.unsplash.com/photo-1608099269227-82de5da1e4a8?w=600&q=80&fit=crop',
  },
  {
    id: 'stone',
    number: '02',
    title: 'Stone Sculptures',
    subtitle: 'Black Basalt & Sandstone',
    pieces: 63,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
  },
  {
    id: 'brass',
    number: '03',
    title: 'Brass Works',
    subtitle: 'Lost-Wax Cast Masterpieces',
    pieces: 48,
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80&fit=crop',
  },
  {
    id: 'terracotta',
    number: '04',
    title: 'Terracotta Art',
    subtitle: 'Earth-fired Traditions',
    pieces: 57,
    image: 'https://images.unsplash.com/photo-1583425423885-d9c2cd0b1077?w=600&q=80&fit=crop',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25,0.46,0.45,0.94] } },
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex-shrink-0 w-64 md:w-auto overflow-hidden cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#162540]/80 via-[#162540]/10 to-transparent" />

        {/* Number badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-white px-2 py-0.5 rounded-full" style={{ background: '#1CB8D2' }}>
            {collection.number}
          </span>
        </div>

        {/* Hover view button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#1CB8D2' }}>
            <ArrowUpRight size={18} className="text-white" />
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold mb-0.5 group-hover:text-[#1CB8D2] transition-colors duration-300" style={{ fontFamily: 'Montserrat Alternates, sans-serif', color: '#162540' }}>
          {collection.title}
        </h3>
        <p className="font-sans text-[11px] tracking-[0.12em] uppercase mb-3" style={{ color: 'rgba(22,37,64,0.5)' }}>
          {collection.subtitle}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-sans text-[12px] font-semibold" style={{ color: '#1CB8D2' }}>
            {collection.pieces} pieces
          </span>
          <ArrowRight
            size={14}
            className="-translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ color: '#1CB8D2' }}
          />
        </div>
      </div>
    </motion.article>
  )
}

export default function Collections() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="collections"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#E0EBF4' }}
      aria-label="Our Collections"
    >
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="section-label-dark mb-4">Curated by Heritage</div>
            <h2
              className="font-display font-light leading-[1.1]"
              style={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                color: '#162540',
              }}
            >
              Our <span className="font-semibold" style={{ color: '#1CB8D2' }}>Collections</span>
            </h2>
          </div>
          <a
            href="#sculptures"
            className="flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors self-start md:self-auto group"
            style={{ color: '#1CB8D2' }}
          >
            View All Pieces
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="flex md:grid md:grid-cols-4 gap-5 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {collections.map((col) => (
            <div key={col.id} style={{ scrollSnapAlign: 'start' }}>
              <CollectionCard collection={col} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

