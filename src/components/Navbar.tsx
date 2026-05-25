import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, LogOut, Menu, MessageCircle, Search, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'Sculptures', href: '#sculptures' },
  { label: 'Artisans', href: '#artisan' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(28,18,0,0.97)' : '#1C1200',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Gold top accent line */}
        <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#C9A84C]/10"
                style={{ border: '2px solid #C9A84C' }}
              >
                <span className="font-display font-bold text-lg leading-none" style={{ color: '#C9A84C', fontFamily: 'Montserrat Alternates, sans-serif' }}>
                  V
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-display font-semibold text-xl tracking-wide text-white group-hover:text-[#C9A84C] transition-colors duration-300"
                  style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}
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
                  className="relative font-sans text-[11px] font-semibold tracking-[0.18em] uppercase text-white/60 hover:text-[#C9A84C] transition-colors duration-300 group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 bg-[#C9A84C] rounded-full" />
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-[#C9A84C] transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              {/* User auth buttons */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors duration-300"
                    style={{ border: '1px solid rgba(28,184,210,0.2)' }}
                  >
                    <User size={14} />
                    <span className="max-w-[100px] truncate text-[11px] font-semibold tracking-[0.1em]">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-[70]"
                          style={{ background: '#2A1C00', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
                        >
                          <div className="px-4 py-3 border-b border-[rgba(28,184,210,0.1)]">
                            <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                            <p className="text-white/40 text-[11px] truncate mt-0.5">{user.email}</p>
                          </div>
                          <Link
                            to="/account"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:text-[#C9A84C] hover:bg-[rgba(28,184,210,0.08)] transition-colors"
                          >
                            <User size={13} />
                            My Account
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:text-red-400 hover:bg-[rgba(220,60,60,0.08)] transition-colors border-t border-[rgba(28,184,210,0.08)]"
                          >
                            <LogOut size={13} />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-white/70 hover:text-[#C9A84C] transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-white transition-all duration-300 rounded-sm"
                    style={{ background: '#C9A84C', color: '#1C1200' }}
                  >
                    Register
                  </Link>
                </div>
              )}

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-4 py-2 font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-white transition-all duration-300 rounded-sm"
                style={{ background: '#C9A84C' }}
              >
                <MessageCircle size={13} />
                WhatsApp
              </a>

              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-[#C9A84C] transition-colors duration-300"
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
                  <Search size={14} className="text-[#C9A84C] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search sculptures, collections..."
                    autoFocus
                    className="flex-1 bg-transparent font-sans text-sm text-white placeholder-white/30 outline-none"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-[#C9A84C] transition-colors">
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
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-80 flex flex-col"
              style={{ background: '#1C1200', borderLeft: '2px solid #C9A84C' }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(28,184,210,0.15)]">
                <span className="font-display text-xl text-white" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                  VinayakArt
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-[#C9A84C] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile user info */}
              {user && (
                <div className="px-6 py-4 border-b border-[rgba(28,184,210,0.1)]" style={{ background: 'rgba(28,184,210,0.06)' }}>
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{user.email}</p>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                    className="flex items-center justify-between py-3.5 font-sans text-sm font-semibold tracking-[0.12em] uppercase text-white/70 hover:text-[#C9A84C] transition-colors group border-b border-white/5"
                  >
                    {link.label}
                    <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </motion.a>
                ))}

                {user ? (
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3.5 font-sans text-sm font-semibold tracking-[0.12em] uppercase text-[#C9A84C] transition-colors group border-b border-white/5"
                  >
                    My Account
                    <ChevronRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3.5 font-sans text-sm font-semibold tracking-[0.12em] uppercase text-white/70 hover:text-[#C9A84C] transition-colors group border-b border-white/5"
                    >
                      Login
                      <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3.5 font-sans text-sm font-semibold tracking-[0.12em] uppercase text-[#C9A84C] transition-colors group border-b border-white/5"
                    >
                      Create Account
                      <ChevronRight size={14} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  </>
                )}
              </div>

              <div className="px-6 pb-8 pt-4 border-t border-[rgba(28,184,210,0.15)] space-y-3">
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 font-sans text-xs font-semibold tracking-[0.15em] uppercase rounded-sm transition-colors"
                    style={{ border: '1px solid rgba(220,60,60,0.4)', color: '#fca5a5' }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                )}
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 font-sans text-xs font-semibold tracking-[0.15em] uppercase text-white rounded-sm"
                  style={{ background: '#C9A84C' }}
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
