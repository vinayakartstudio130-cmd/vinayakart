import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Menu, MessageCircle, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'Sculptures', href: '#sculptures' },
  { label: 'Artisans', href: '#artisan' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(22,37,64,0.97)' : '#162540',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid rgba(28,184,210,0.12)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {/* Cyan top accent line */}
        <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #1CB8D2, transparent)' }} />

        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#1CB8D2]/10"
                style={{ border: '2px solid #1CB8D2' }}
              >
                <span className="font-display font-bold text-lg leading-none" style={{ color: '#1CB8D2', fontFamily: 'Cormorant Garamond, serif' }}>
                  V
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-display font-semibold text-xl tracking-wide text-white group-hover:text-[#1CB8D2] transition-colors duration-300"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  VinayakArt
                </span>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#1CB8D2]/70 mt-0.5">
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
                  className="relative font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 hover:text-[#1CB8D2] transition-colors duration-300 group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#1CB8D2] rounded-full" />
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-[#1CB8D2] transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-white transition-all duration-300 rounded-sm"
                style={{ background: '#1CB8D2' }}
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>

              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-[#1CB8D2] transition-colors duration-300"
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
              className="overflow-hidden border-t border-[rgba(28,184,210,0.15)]"
            >
              <div className="section-container py-3">
                <div className="flex items-center gap-3">
                  <Search size={14} className="text-[#1CB8D2] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search sculptures, collections..."
                    autoFocus
                    className="flex-1 bg-transparent font-sans text-sm text-white placeholder-white/30 outline-none"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-[#1CB8D2] transition-colors">
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
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25,0.46,0.45,0.94] }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-80 flex flex-col"
              style={{ background: '#162540', borderLeft: '2px solid #1CB8D2' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(28,184,210,0.15)]">
                <span className="font-display text-xl text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  VinayakArt
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-[#1CB8D2] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    className="flex items-center justify-between py-3.5 font-sans text-sm font-semibold tracking-[0.12em] uppercase text-white/70 hover:text-[#1CB8D2] transition-colors group border-b border-white/5"
                  >
                    {link.label}
                    <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </motion.a>
                ))}
              </div>

              <div className="px-6 pb-8 pt-4 border-t border-[rgba(28,184,210,0.15)]">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 font-sans text-xs font-semibold tracking-[0.15em] uppercase text-white rounded-sm"
                  style={{ background: '#1CB8D2' }}
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
