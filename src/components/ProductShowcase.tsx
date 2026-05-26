import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { AlertCircle, CheckCircle, Copy, Eye, Heart, Loader2, ShoppingBag, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { apiRequest, getUserToken } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const UPI_ID = import.meta.env.VITE_UPI_ID as string | undefined
const UPI_NAME = import.meta.env.VITE_UPI_NAME as string | undefined || 'VinayakArt'

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

const fallbackProducts: Product[] = [
  {
    _id: 'fallback-1',
    name: 'Chhatrapati Shivaji Maharaj on Horseback',
    material: 'Bronze Cast',
    price: 95000,
    badge: 'Bestseller',
    badgeColor: 'gold',
    category: 'brass',
    image: '/images/gallery/chatrapathi shivaji maharaj on a horse.jpeg',
    dimensions: '24" x 10" x 18"',
    stock: 1,
  },
  {
    _id: 'fallback-2',
    name: 'Chhatrapati Shivaji Maharaj',
    material: 'Black Stone',
    price: 65000,
    badge: 'Heritage',
    badgeColor: 'stone',
    category: 'stone',
    image: '/images/gallery/chatrapathi shivaji maharaj.jpeg',
    dimensions: '18" x 8" x 6"',
    stock: 1,
  },
  {
    _id: 'fallback-3',
    name: 'Golden Shivaji Maharaj',
    material: 'Panchaloha Brass',
    price: 110000,
    badge: 'Rare',
    badgeColor: 'red',
    category: 'brass',
    image: '/images/gallery/golden chatrapthi shivaji maharaj.jpeg',
    dimensions: '22" x 10" x 8"',
    stock: 1,
  },
  {
    _id: 'fallback-4',
    name: 'Swami Samarth',
    material: 'Bronze Cast',
    price: 55000,
    badgeColor: 'stone',
    category: 'brass',
    image: '/images/gallery/swami samarth.jpeg',
    dimensions: '16" x 8" x 6"',
    stock: 2,
  },
  {
    _id: 'fallback-5',
    name: 'Swami Samarth Seated',
    material: 'Panchaloha Brass',
    price: 48000,
    badge: 'Bestseller',
    badgeColor: 'gold',
    category: 'brass',
    image: '/images/gallery/swami samarth sitting.jpeg',
    dimensions: '14" x 10" x 8"',
    stock: 2,
  },
  {
    _id: 'fallback-6',
    name: 'Golden Shiva Statue',
    material: 'Panchaloha Brass',
    price: 72000,
    badgeColor: 'gold',
    category: 'brass',
    image: '/images/gallery/golden shiva statue.jpeg',
    dimensions: '20" x 10" x 8"',
    stock: 1,
  },
  {
    _id: 'fallback-7',
    name: 'Shiva Black Stone',
    material: 'Black Basalt Stone',
    price: 58000,
    badge: 'Rare',
    badgeColor: 'red',
    category: 'stone',
    image: '/images/gallery/shiva black statue.jpeg',
    dimensions: '18" x 10" x 7"',
    stock: 1,
  },
  {
    _id: 'fallback-8',
    name: 'Dattatreya Brass Statue',
    material: 'Panchaloha Brass',
    price: 68000,
    badgeColor: 'stone',
    category: 'brass',
    image: '/images/gallery/dattatreya brass statue.jpeg',
    dimensions: '20" x 12" x 8"',
    stock: 1,
  },
  {
    _id: 'fallback-9',
    name: 'Handcrafted Sculpture',
    material: 'Mixed Media',
    price: 42000,
    badgeColor: 'stone',
    category: 'stone',
    image: '/images/gallery/1.jpeg',
    dimensions: '14" x 8" x 6"',
    stock: 3,
  },
]

const filters = [
  { label: 'All',        image: '/images/gallery/chatrapathi shivaji maharaj on a horse.jpeg' },
  { label: 'Stone',      image: '/images/gallery/shiva black statue.jpeg' },
  { label: 'Brass',      image: '/images/gallery/dattatreya brass statue.jpeg' },
  { label: 'Terracotta', image: '/images/gallery/swami samarth.jpeg' },
  { label: 'Wood',       image: '/images/gallery/1.jpeg' },
]

const badgeStyles: Record<string, React.CSSProperties> = {
  gold: {
    background: '#D4AF37',
    color: '#FFFFFF',
  },
  red: {
    background: 'rgba(220, 60, 60, 0.9)',
    color: '#FFFFFF',
  },
  stone: {
    background: 'rgba(80, 100, 120, 0.85)',
    color: '#FFFFFF',
  },
}

type CheckoutStep = 'details' | 'qr' | 'utr' | 'success'

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
      className="group relative overflow-hidden card-lift rounded-xl"
      style={{
        background: '#3D1010',
        border: '1px solid rgba(212,175,55,0.15)',
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#6B0000] via-transparent to-transparent" />

        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
              style={badgeStyles[product.badgeColor]}
            >
              {product.badge}
            </span>
          </div>
        )}

        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-full"
          style={{ background: 'rgba(45,10,10,0.8)', border: '1px solid rgba(212,175,55,0.3)' }}
          aria-label="Add to wishlist"
        >
          <Heart
            size={13}
            className={wishlisted ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-white/60'}
          />
        </button>

        <div
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-between px-4 py-3 z-10"
          style={{ background: 'rgba(45,10,10,0.95)', borderTop: '1px solid rgba(212,175,55,0.2)' }}
        >
          <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#D4AF37]">
            {product.dimensions}
          </span>
          <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-white/60">
            <Eye size={12} />
            Available {product.stock}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {product.material}
        </p>
        <h3
          className="font-display font-semibold text-white mb-3 leading-snug group-hover:text-[#D4AF37] transition-colors duration-300"
          style={{
            fontFamily: 'Montserrat Alternates, sans-serif',
            fontSize: 'clamp(1.0rem, 1.8vw, 1.2rem)',
          }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <span
            className="font-display font-bold text-white"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: '1.25rem' }}
          >
            {currency.format(product.price)}
          </span>
          <button
            className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-white hover:text-[#D4AF37] transition-colors disabled:opacity-40"
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
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('All')
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [step, setStep] = useState<CheckoutStep>('details')
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '' })
  const [utr, setUtr] = useState('')
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
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
      .then(({ products: live }) => {
        if (live.length > 0) setProducts(live)
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setIsLoading(false))
  }, [])

  const openCheckout = (product: Product) => {
    setBuyer({ name: user?.name ?? '', email: user?.email ?? '', phone: '' })
    setUtr('')
    setError('')
    setStep('details')
    setSelectedProduct(product)
  }

  const closeCheckout = () => {
    setSelectedProduct(null)
    setStep('details')
    setError('')
    setUtr('')
  }

  const handleDetailsSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setStep('qr')
  }

  const copyUpiId = () => {
    if (!UPI_ID) return
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleConfirmOrder = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setError('')
    setIsBusy(true)
    try {
      const userToken = getUserToken()
      await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          productId: selectedProduct._id,
          ...buyer,
          upiTransactionId: utr.trim(),
        }),
        headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
      })
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order. Please try again.')
    } finally {
      setIsBusy(false)
    }
  }

  const filtered = activeFilter === 'All'
    ? products
    : products.filter((p) => p.category === activeFilter.toLowerCase())

  return (
    <section
      id="sculptures"
      className="py-20 md:py-28"
      style={{ background: '#6B0000' }}
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
            className="font-display font-light text-white leading-[1.1]"
            style={{
              fontFamily: 'Montserrat Alternates, sans-serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            }}
          >
            Featured <span className="font-semibold" style={{ color: '#D4AF37' }}>Sculptures</span>
          </h2>
        </motion.div>

        <motion.div
          className="flex items-end justify-center gap-6 md:gap-10 mb-10 md:mb-14 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.label
            return (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className="flex flex-col items-center gap-2 focus:outline-none transition-all duration-300"
                style={{ transform: isActive ? 'scale(1.1)' : 'scale(0.9)', opacity: isActive ? 1 : 0.55 }}
              >
                <div
                  className="rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    width: isActive ? '72px' : '56px',
                    height: isActive ? '72px' : '56px',
                    border: isActive ? '3px solid #D4AF37' : '2px solid rgba(212,175,55,0.3)',
                    boxShadow: isActive ? '0 0 0 4px rgba(212,175,55,0.2)' : 'none',
                  }}
                >
                  <img src={filter.image} alt={filter.label} className="w-full h-full object-cover" />
                </div>
                <span
                  className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300"
                  style={{ color: isActive ? '#D4AF37' : 'rgba(255,255,255,0.5)' }}
                >
                  {filter.label}
                </span>
              </button>
            )
          })}
        </motion.div>

        {isLoading && (
          <div className="mb-8 flex items-center justify-center gap-3 text-sm text-white/50">
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
                onBuy={openCheckout}
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
          <div className="mb-8" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
          <a href="#contact" className="btn-ghost">
            Request the Full Catalogue
          </a>
        </motion.div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl shadow-2xl my-auto"
            style={{ background: '#3D1010', border: '2px solid rgba(212,175,55,0.3)' }}
          >
            {/* Header — always visible */}
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-[rgba(28,184,210,0.12)]">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]/70 mb-1">
                  {step === 'details' && 'Step 1 of 3 · Your Details'}
                  {step === 'qr'      && 'Step 2 of 3 · Pay via UPI'}
                  {step === 'utr'     && 'Step 3 of 3 · Confirm Payment'}
                  {step === 'success' && 'Order Placed'}
                </p>
                <h3 className="text-white font-semibold text-xl leading-snug" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                  {selectedProduct.name}
                </h3>
                <p className="text-[#D4AF37] font-bold mt-0.5">{currency.format(selectedProduct.price)}</p>
              </div>
              <button onClick={closeCheckout} className="text-white/40 hover:text-white transition-colors mt-1 flex-shrink-0">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
                  style={{ background: 'rgba(220,60,60,0.12)', border: '1px solid rgba(220,60,60,0.3)', color: '#fca5a5' }}>
                  <AlertCircle size={14} className="flex-shrink-0" /> {error}
                </div>
              )}

              {/* Step 1: Customer Details */}
              {step === 'details' && (
                <form onSubmit={handleDetailsSubmit} className="space-y-3">
                  {[
                    { key: 'name',  placeholder: 'Full name',       type: 'text',  required: true },
                    { key: 'email', placeholder: 'Email address',    type: 'email', required: true },
                    { key: 'phone', placeholder: 'Phone / WhatsApp', type: 'tel',   required: false },
                  ].map(({ key, placeholder, type, required }) => (
                    <input
                      key={key}
                      type={type}
                      value={buyer[key as keyof typeof buyer]}
                      onChange={(e) => setBuyer((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required={required}
                      className="w-full px-4 py-3 text-sm text-white outline-none rounded-lg placeholder-white/30"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(28,184,210,0.25)' }}
                    />
                  ))}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase mt-1"
                    style={{ background: '#D4AF37', color: '#162540' }}
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Step 2: UPI QR Code */}
              {step === 'qr' && (
                <div className="text-center">
                  {UPI_ID ? (
                    <>
                      <p className="text-white/60 text-sm mb-4">
                        Scan the QR code with any UPI app and pay <span className="text-[#D4AF37] font-bold">{currency.format(selectedProduct.price)}</span>
                      </p>

                      <div className="inline-block p-4 rounded-xl mb-4" style={{ background: '#FFFFFF' }}>
                        <QRCodeSVG
                          value={`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedProduct.price}&cu=INR&tn=${encodeURIComponent(`Order: ${selectedProduct.name}`)}`}
                          size={200}
                          bgColor="#FFFFFF"
                          fgColor="#162540"
                          level="M"
                        />
                      </div>

                      <div
                        className="flex items-center justify-between gap-3 rounded-lg px-4 py-3 mb-5"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(28,184,210,0.2)' }}
                      >
                        <div className="text-left min-w-0">
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">UPI ID</p>
                          <p className="text-white font-mono text-sm truncate">{UPI_ID}</p>
                        </div>
                        <button
                          type="button"
                          onClick={copyUpiId}
                          className="flex items-center gap-1.5 text-xs font-semibold flex-shrink-0 transition-colors"
                          style={{ color: copied ? '#6ee7b7' : '#D4AF37' }}
                        >
                          {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg px-4 py-6 mb-5 text-center" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                      <p className="text-yellow-200 text-sm">UPI ID not configured yet.</p>
                      <p className="text-yellow-200/60 text-xs mt-1">Set <code>VITE_UPI_ID</code> in your .env file.</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setError(''); setStep('utr') }}
                    className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider uppercase"
                    style={{ background: '#D4AF37', color: '#162540' }}
                  >
                    I've Completed Payment →
                  </button>
                  <button
                    onClick={() => setStep('details')}
                    className="w-full py-2.5 mt-2 text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Step 3: Enter UTR */}
              {step === 'utr' && (
                <form onSubmit={handleConfirmOrder} className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-4">
                      Enter the <span className="text-white font-medium">UPI Transaction ID</span> (UTR) from your payment app. You'll find it in the transaction receipt.
                    </p>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                      UPI Transaction ID / UTR
                    </label>
                    <input
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="e.g. 123456789012"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 text-sm text-white outline-none rounded-lg font-mono placeholder-white/25"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(28,184,210,0.25)' }}
                    />
                    <p className="text-white/30 text-xs mt-1.5">
                      12-digit reference shown after payment in GPay, PhonePe, Paytm, etc.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isBusy || !utr.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase disabled:opacity-50"
                    style={{ background: '#D4AF37', color: '#162540' }}
                  >
                    {isBusy ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
                    {isBusy ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('qr')}
                    className="w-full py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    ← Back to QR Code
                  </button>
                </form>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <div className="text-center py-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}
                  >
                    <CheckCircle size={28} style={{ color: '#6ee7b7' }} />
                  </div>
                  <h4 className="text-white font-semibold text-xl mb-2" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                    Order Placed!
                  </h4>
                  <p className="text-white/60 text-sm mb-1">
                    We're verifying your payment.
                  </p>
                  <p className="text-white/40 text-xs mb-6">
                    You'll see the status update in <span className="text-[#D4AF37]">My Account → Orders</span> once confirmed.
                  </p>
                  <button
                    onClick={() => {
                      closeCheckout()
                      setStatusMessage('Order placed! We\'ll verify your payment and update the status shortly.')
                    }}
                    className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider uppercase"
                    style={{ background: '#D4AF37', color: '#162540' }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}

