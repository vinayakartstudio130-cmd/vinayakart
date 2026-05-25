import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Instagram, Facebook, Youtube } from 'lucide-react'

const footerLinks = {
  Collections: ['Sacred Idols', 'Stone Sculptures', 'Brass Works', 'Terracotta Art', 'Wood Carvings'],
  Company: ['About VinayakArt', 'Our Artisans', 'Authenticity', 'Press & Media', 'Careers'],
  Services: ['Custom Commission', 'Valuation', 'White-Glove Delivery', 'Collector Concierge', 'Trade-Up Programme'],
  Support: ['Contact Us', 'FAQs', 'Shipping & Returns', 'Privacy Policy', 'Terms of Service'],
}

const socials = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/vinayakartstudioo?igsh=ZWRmaTRna3htZmJ3' },
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61570960241164&mibextid=ZbWKwL' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/channel/UCWZR3_9uBfcG8FOoV7VZQvQ' },
]

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <footer
        id="footer"
        className="overflow-hidden"
        style={{ background: '#FAF7F2' }}
        aria-label="Site footer"
      >
        {/* Main footer */}
        <div className="section-container py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

            {/* Brand column */}
            <div className="md:col-span-3">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: '2px solid #D4AF37' }}
                >
                  <span className="font-display font-bold text-lg leading-none" style={{ color: '#D4AF37', fontFamily: 'Montserrat Alternates, sans-serif' }}>
                    V
                  </span>
                </div>
                <div>
                  <span className="font-display font-semibold text-xl block" style={{ fontFamily: 'Montserrat Alternates, sans-serif', color: '#1C1200' }}>
                    VinayakArt
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase" style={{ color: '#D4AF37' }}>
                    Maharashtra's Finest
                  </span>
                </div>
              </div>

              <p className="font-sans text-[0.8125rem] leading-relaxed mb-6" style={{ color: 'rgba(28,8,0,0.5)' }}>
                Collector-grade Maharashtrian sculptures, brass works, and devotional art â€”
                sourced directly from master artisan families and delivered worldwide.
              </p>

              <div className="flex items-center gap-2 mb-6">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center hover:text-[#D4AF37] transition-all duration-300 rounded-lg group"
                    style={{ color: 'rgba(28,8,0,0.4)', background: 'rgba(28,8,0,0.04)', border: '1px solid rgba(28,8,0,0.1)' }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <s.icon size={14} className="group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {['Govt. of India Registered', 'ASI Compliant', '25 Years Heritage'].map((badge) => (
                  <span
                    key={badge}
                    className="font-sans text-[9px] tracking-[0.18em] uppercase px-2 py-1 self-start rounded"
                    style={{ border: '1px solid rgba(212,175,55,0.3)', color: 'rgba(28,8,0,0.45)', background: 'rgba(212,175,55,0.06)' }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden md:block md:col-span-1" />

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="md:col-span-2">
                <h4 className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: '#D4AF37' }}>
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-sans text-[12px] leading-relaxed transition-colors duration-300 hover:text-[#D4AF37]" style={{ color: 'rgba(28,8,0,0.5)' }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider-cyan mx-8 md:mx-16 opacity-30" />

        {/* Bottom bar */}
        <div className="section-container py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-sans text-[11px] tracking-[0.08em]" style={{ color: 'rgba(28,8,0,0.35)' }}>
              &copy; {new Date().getFullYear()} VinayakArt. All rights reserved. Maharashtra, India.
            </p>
            <div className="flex items-center gap-5">
              {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((link) => (
                <a key={link} href="#" className="font-sans text-[11px] transition-colors hover:text-[#D4AF37]" style={{ color: 'rgba(28,8,0,0.35)' }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full shadow-lg"
            style={{ background: '#D4AF37' }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

