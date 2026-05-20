import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ArrowUp, Instagram, Facebook, Youtube, Twitter } from 'lucide-react'

const footerLinks = {
  Collections: [
    'Sacred Idols',
    'Stone Sculptures',
    'Brass Works',
    'Terracotta Art',
    'Wood Carvings',
  ],
  Company: [
    'About VinayakArt',
    'Our Artisans',
    'Authenticity',
    'Press & Media',
    'Careers',
  ],
  Services: [
    'Custom Commission',
    'Valuation',
    'White-Glove Delivery',
    'Collector Concierge',
    'Trade-Up Programme',
  ],
  Support: [
    'Contact Us',
    'FAQs',
    'Shipping & Returns',
    'Privacy Policy',
    'Terms of Service',
  ],
}

const socials = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
]

const badges = [
  'Govt. of India Registered',
  'ASI Compliant',
  '25 Years',
]

function SocialLink({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-all duration-300 group"
      style={{ border: '1px solid rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.03)' }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon size={14} className="group-hover:scale-110 transition-transform" />
    </a>
  )
}

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
        style={{ background: '#080808' }}
        aria-label="Site footer"
      >
        {/* Gold CTA strip */}
        <div
          className="py-5 px-6"
          style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: 'rgba(201,168,76,0.04)' }}
        >
          <div className="section-container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p
                  className="font-display font-light text-[#F5F0E8]"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem' }}
                >
                  Something specific in mind?
                </p>
                <p className="font-sans text-[11px] tracking-[0.1em] text-[#F5F0E8]/40 mt-0.5">
                  Our curators are available 7 days a week.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 font-sans text-[11px] font-medium tracking-[0.14em] uppercase text-[#0a0a0a]"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}
                >
                  <MessageCircle size={13} />
                  WhatsApp Us
                </a>
                <a
                  href="#contact"
                  className="flex items-center gap-2 px-5 py-2.5 font-sans text-[11px] font-medium tracking-[0.14em] uppercase text-[#C9A84C] hover:bg-[rgba(201,168,76,0.08)] transition-colors"
                  style={{ border: '1px solid rgba(201,168,76,0.4)' }}
                >
                  Send Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="section-container py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

            {/* Brand column */}
            <div className="md:col-span-3">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: '1.5px solid rgba(201,168,76,0.5)' }}
                >
                  <span
                    className="font-display font-semibold text-lg leading-none"
                    style={{ color: '#C9A84C', fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    V
                  </span>
                </div>
                <div>
                  <span
                    className="font-display font-semibold text-xl text-[#F5F0E8] block"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    VinayakArt
                  </span>
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#C9A84C]/60">
                    Maharashtra's Finest
                  </span>
                </div>
              </div>

              <p className="font-sans text-[0.8125rem] text-[#F5F0E8]/35 leading-relaxed mb-6">
                Collector-grade Maharashtrian sculptures, brass works, and devotional art —
                sourced directly from master artisan families and delivered worldwide.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2 mb-6">
                {socials.map((s) => (
                  <SocialLink key={s.label} {...s} />
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-col gap-1.5">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#F5F0E8]/25 px-2 py-1 self-start"
                    style={{ border: '1px solid rgba(201,168,76,0.08)' }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-1" />

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="md:col-span-2">
                <h4 className="font-sans text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] mb-5">
                  {heading}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-[12px] text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors duration-300 leading-relaxed"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}
        >
          <div className="section-container py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="font-sans text-[11px] text-[#F5F0E8]/25 tracking-[0.08em]">
                &copy; {new Date().getFullYear()} VinayakArt. All rights reserved. Maharashtra, India.
              </p>
              <div className="flex items-center gap-5">
                {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-sans text-[11px] text-[#F5F0E8]/25 hover:text-[#C9A84C] transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} className="text-[#0a0a0a]" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
