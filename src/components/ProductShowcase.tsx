import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ShoppingBag, Eye, Heart } from 'lucide-react'

interface Product {
  id: number
  name: string
  material: string
  price: string
  badge?: string
  badgeColor: 'gold' | 'stone' | 'red'
  category: string
  image: string
  dimensions: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Ganesha in Black Basalt',
    material: 'Black Basalt Stone',
    price: '₹48,000',
    badge: 'Rare',
    badgeColor: 'red',
    category: 'stone',
    image: 'https://images.unsplash.com/photo-1608099269227-82de5da1e4a8?w=600&q=80&fit=crop',
    dimensions: '18" × 12" × 8"',
  },
  {
    id: 2,
    name: 'Dancing Shiva Nataraja',
    material: 'Panchaloha Brass',
    price: '₹72,000',
    badge: 'Bestseller',
    badgeColor: 'gold',
    category: 'brass',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80&fit=crop',
    dimensions: '24" × 14" × 6"',
  },
  {
    id: 3,
    name: 'Vitthal of Pandharpur',
    material: 'Nashik Terracotta',
    price: '₹28,500',
    badge: 'New',
    badgeColor: 'gold',
    category: 'terracotta',
    image: 'https://images.unsplash.com/photo-1583425423885-d9c2cd0b1077?w=600&q=80&fit=crop',
    dimensions: '16" × 9" × 7"',
  },
  {
    id: 4,
    name: 'Kolhapuri Mahalakshmi',
    material: 'Sandstone with Gilt',
    price: '₹95,000',
    badge: 'Rare',
    badgeColor: 'red',
    category: 'stone',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&fit=crop',
    dimensions: '30" × 15" × 9"',
  },
  {
    id: 5,
    name: 'Saraswati in Teak Wood',
    material: 'Aged Burmese Teak',
    price: '₹54,000',
    badgeColor: 'stone',
    category: 'wood',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80&fit=crop',
    dimensions: '22" × 11" × 7"',
  },
  {
    id: 6,
    name: 'Peshwa-Era Relief Panel',
    material: 'Deccan Basalt',
    price: '₹1,20,000',
    badge: 'Investment',
    badgeColor: 'gold',
    category: 'stone',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80&fit=crop',
    dimensions: '36" × 24" × 4"',
  },
]

const filters = ['All', 'Stone', 'Brass', 'Terracotta', 'Wood']

const badgeStyles: Record<string, React.CSSProperties> = {
  gold: {
    background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
    color: '#0a0a0a',
  },
  red: {
    background: 'rgba(180, 40, 40, 0.85)',
    color: '#F5F0E8',
  },
  stone: {
    background: 'rgba(100, 90, 80, 0.6)',
    color: '#F5F0E8',
  },
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden card-lift"
      style={{
        background: '#141210',
        border: '1px solid rgba(201,168,76,0.08)',
      }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          style={{ filter: 'brightness(0.8) contrast(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className="font-sans text-[9px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1"
              style={badgeStyles[product.badgeColor]}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(10,10,10,0.7)', border: '1px solid rgba(201,168,76,0.2)' }}
          aria-label="Add to wishlist"
        >
          <Heart
            size={13}
            className={wishlisted ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#F5F0E8]/60'}
          />
        </button>

        {/* Quick-view bar — slides up from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out flex items-center justify-between px-4 py-3 z-10"
          style={{ background: 'rgba(10,10,10,0.92)', borderTop: '1px solid rgba(201,168,76,0.15)' }}
        >
          <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#C9A84C]">
            {product.dimensions}
          </span>
          <button className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors">
            <Eye size={12} />
            Quick View
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 md:p-5">
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#F5F0E8]/35 mb-1">
          {product.material}
        </p>
        <h3
          className="font-display font-medium text-[#F5F0E8] mb-3 leading-snug group-hover:text-[#C9A84C] transition-colors duration-300"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(1.0rem, 1.8vw, 1.2rem)',
          }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span
            className="font-display font-semibold gold-text"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem' }}
          >
            {product.price}
          </span>
          <button
            className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-[#C9A84C] hover:text-[#F0D080] transition-colors group/btn"
            aria-label={`Add ${product.name} to collection`}
          >
            <ShoppingBag size={12} />
            <span className="hidden sm:inline">Add to Collection</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProductShowcase() {
  const [activeFilter, setActiveFilter] = useState('All')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category === activeFilter.toLowerCase())

  return (
    <section
      id="sculptures"
      className="py-20 md:py-28"
      style={{ background: '#111111' }}
      aria-label="Featured Sculptures"
    >
      <div className="section-container" ref={ref}>
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-4">
            <span className="section-label">Hand-Picked for Collectors</span>
          </div>
          <h2
            className="font-display font-light text-[#F5F0E8] leading-[1.1]"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            }}
          >
            Featured <em style={{ color: '#C9A84C' }}>Sculptures</em>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex items-center justify-center gap-1 mb-10 md:mb-14 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="relative px-5 py-2 font-sans text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300"
              style={{
                color: activeFilter === filter ? '#0a0a0a' : '#F5F0E8',
                opacity: activeFilter === filter ? 1 : 0.45,
                background: activeFilter === filter
                  ? 'linear-gradient(135deg, #C9A84C, #F0D080)'
                  : 'transparent',
                border: activeFilter === filter
                  ? 'none'
                  : '1px solid rgba(201,168,76,0.15)',
              }}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Product grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View all CTA */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="divider-gold mb-8" />
          <a href="#contact" className="btn-ghost-gold">
            Request the Full Catalogue
          </a>
        </motion.div>
      </div>
    </section>
  )
}
