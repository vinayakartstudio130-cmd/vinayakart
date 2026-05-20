import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, X, Menu, MessageCircle, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'Sculptures', href: '#sculptures' },
  { label: 'Artisans', href: '#artisan' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount] = useState(2)
  const [searchOpen, setSearchOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Gold top line */}
      <div
        className="fixed top-0 left-0 right-0 h-px z-[60]"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, #F0D080, #C9A84C, transparent)' }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[rgba(201,168,76,0.08)]">
        {/* Thin gold top accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />

        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: '1.5px solid rgba(201,168,76,0.6)' }}
              >
                <span
                  className="font-display font-semibold text-lg leading-none"
                  style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif' }}
                >
                  V
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-display font-semibold text-xl tracking-wide text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  VinayakArt
                </span>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]/70 mt-0.5">
                  Maharashtra's Finest
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors duration-300 group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-[#C9A84C] to-[#F0D080]" />
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-[#C9A84C] font-sans text-[10px] font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[rgba(201,168,76,0.08)]"
                style={{ border: '1px solid rgba(201,168,76,0.4)' }}
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>

              {/* Cart */}
              <button
                className="relative w-9 h-9 flex items-center justify-center text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors duration-300"
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center font-sans text-[9px] font-semibold text-[#0a0a0a]"
                    style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors duration-300"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-[rgba(201,168,76,0.08)]"
            >
              <div className="section-container py-3">
                <div className="flex items-center gap-3">
                  <Search size={14} className="text-[#C9A84C] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search sculptures, collections..."
                    autoFocus
                    className="flex-1 bg-transparent font-sans text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/30 outline-none"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-80 flex flex-col"
              style={{ background: '#0a0a0a', borderLeft: '1px solid rgba(201,168,76,0.12)' }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}
              >
                <span
                  className="font-display text-xl text-[#F5F0E8]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  VinayakArt
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    className="flex items-center justify-between py-3.5 font-sans text-sm font-medium tracking-[0.12em] uppercase text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors group"
                    style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                  >
                    {link.label}
                    <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </motion.a>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="px-6 pb-8 pt-4 space-y-3" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 font-sans text-xs font-medium tracking-[0.15em] uppercase text-[#0a0a0a]"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}
                >
                  <MessageCircle size={14} />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
