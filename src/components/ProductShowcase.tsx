import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { AlertCircle, CheckCircle, Eye, Heart, Loader2, ShoppingBag, X } from 'lucide-react'
import { apiRequest } from '../lib/api'

interface Product {
  _id: string
  name: string
  material: string
  price: number
  badge?: string
  badgeColor: 'gold' | 'stone' | 'red'
  category: string
  image: string
  dimensions: string
  stock: number
}

interface PaymentConfig {
  razorpayKeyId: string
}

const fallbackProducts: Product[] = [
  {
    _id: 'fallback-1',
    name: 'Ganesha in Black Basalt',
    material: 'Black Basalt Stone',
    price: 48000,
    badge: 'Rare',
    badgeColor: 'red',
    category: 'stone',
    image: 'https://images.unsplash.com/photo-1608099269227-82de5da1e4a8?w=600&q=80&fit=crop',
    dimensions: '18" x 12" x 8"',
    stock: 1,
  },
  {
    _id: 'fallback-2',
    name: 'Dancing Shiva Nataraja',
    material: 'Panchaloha Brass',
    price: 72000,
    badge: 'Bestseller',
    badgeColor: 'gold',
    category: 'brass',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80&fit=crop',
    dimensions: '24" x 14" x 6"',
    stock: 1,
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

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

interface ProductCardProps {
  product: Product
  onBuy: (product: Product) => void
  currency: Intl.NumberFormat
}

function ProductCard({ product, onBuy, currency }: ProductCardProps) {
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
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          style={{ filter: 'brightness(0.8) contrast(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />

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

        <div
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out flex items-center justify-between px-4 py-3 z-10"
          style={{ background: 'rgba(10,10,10,0.92)', borderTop: '1px solid rgba(201,168,76,0.15)' }}
        >
          <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#C9A84C]">
            {product.dimensions}
          </span>
          <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-[#F5F0E8]/70">
            <Eye size={12} />
            Available {product.stock}
          </span>
        </div>
      </div>

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
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-display font-semibold gold-text"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem' }}
          >
            {currency.format(product.price)}
          </span>
          <button
            className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-[#C9A84C] hover:text-[#F0D080] transition-colors group/btn disabled:opacity-40"
            aria-label={`Buy ${product.name}`}
            disabled={product.stock <= 0}
            onClick={() => onBuy(product)}
          >
            <ShoppingBag size={12} />
            <span className="hidden sm:inline">{product.stock > 0 ? 'Buy Now' : 'Sold'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default function ProductShowcase() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '' })
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const currency = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    [],
  )

  useEffect(() => {
    apiRequest<{ products: Product[] }>('/api/products')
      .then((response) => {
        if (response.products.length > 0) {
          setProducts(response.products)
        }
      })
      .catch(() => {
        setError('Live catalogue is temporarily unavailable. Showing curated highlights.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category === activeFilter.toLowerCase())

  const startPayment = async (event: FormEvent) => {
    event.preventDefault()

    if (!selectedProduct) return

    setError('')
    setStatusMessage('')
    setIsPaying(true)

    try {
      const [scriptLoaded, config] = await Promise.all([
        loadRazorpayScript(),
        apiRequest<PaymentConfig>('/api/config'),
      ])

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Payment checkout failed to load. Please try again.')
      }

      if (!config.razorpayKeyId) {
        throw new Error('Online payments are not active yet. Please contact us to reserve this piece.')
      }

      const order = await apiRequest<{
        orderId: string
        razorpayOrderId: string
        amount: number
        currency: string
      }>('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          productId: selectedProduct._id,
          ...buyer,
        }),
      })

      const checkout = new window.Razorpay({
        key: config.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'VinayakArt',
        description: selectedProduct.name,
        order_id: order.razorpayOrderId,
        prefill: buyer,
        theme: { color: '#C9A84C' },
        handler: async (response: Record<string, string>) => {
          await apiRequest('/api/payments/verify', {
            method: 'POST',
            body: JSON.stringify({
              orderId: order.orderId,
              ...response,
            }),
          })
          setSelectedProduct(null)
          setStatusMessage('Payment verified. Our curator will contact you with fulfilment details.')
        },
      })

      checkout.open()
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'Payment could not be started.')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <section
      id="sculptures"
      className="py-20 md:py-28"
      style={{ background: '#111111' }}
      aria-label="Featured Sculptures"
    >
      <div className="section-container" ref={ref}>
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

        {isLoading && (
          <div className="mb-8 flex items-center justify-center gap-3 text-sm text-[#F5F0E8]/50">
            <Loader2 size={16} className="animate-spin" />
            Loading live catalogue
          </div>
        )}

        {statusMessage && (
          <div className="mb-8 flex items-center gap-3 border border-emerald-400/30 bg-emerald-950/30 p-4 text-sm text-emerald-100">
            <CheckCircle size={16} />
            {statusMessage}
          </div>
        )}

        {error && (
          <div className="mb-8 flex items-start gap-3 border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">
            <AlertCircle size={16} className="mt-0.5" />
            {error}
          </div>
        )}

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
              <ProductCard
                key={product._id}
                product={product}
                onBuy={setSelectedProduct}
                currency={currency}
              />
            ))}
          </motion.div>
        </AnimatePresence>

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

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4">
          <form
            onSubmit={startPayment}
            className="w-full max-w-md border border-[#C9A84C]/20 bg-[#141210] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="section-label mb-3">Secure Checkout</p>
                <h3 className="font-display text-3xl">{selectedProduct.name}</h3>
                <p className="mt-1 text-[#C9A84C]">{currency.format(selectedProduct.price)}</p>
              </div>
              <button type="button" onClick={() => setSelectedProduct(null)} aria-label="Close checkout">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={buyer.name}
                onChange={(event) => setBuyer((previous) => ({ ...previous, name: event.target.value }))}
                placeholder="Full name"
                className="w-full border border-[#C9A84C]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={buyer.email}
                onChange={(event) => setBuyer((previous) => ({ ...previous, email: event.target.value }))}
                placeholder="Email"
                type="email"
                className="w-full border border-[#C9A84C]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={buyer.phone}
                onChange={(event) => setBuyer((previous) => ({ ...previous, phone: event.target.value }))}
                placeholder="Phone / WhatsApp"
                className="w-full border border-[#C9A84C]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
              />
            </div>
            <button className="btn-gold mt-5 w-full justify-center" disabled={isPaying}>
              {isPaying ? 'Opening Checkout...' : 'Pay Securely'}
              {isPaying ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
