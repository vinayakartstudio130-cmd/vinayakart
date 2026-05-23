import { useState, useRef, FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2, MessageCircle } from 'lucide-react'
import { apiRequest } from '../lib/api'

type EnquiryType = '' | 'commission' | 'purchase' | 'valuation' | 'wholesale' | 'press'

interface FormState {
  name: string
  email: string
  phone: string
  enquiry: EnquiryType
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface EnquiryResponse {
  message?: string
}

const enquiryTypes = [
  { value: 'commission', label: 'Commission a Piece' },
  { value: 'purchase', label: 'Purchase Enquiry' },
  { value: 'valuation', label: 'Valuation Request' },
  { value: 'wholesale', label: 'Wholesale / Gallery' },
  { value: 'press', label: 'Press & Media' },
]

export default function Newsletter() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', enquiry: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'A valid email is required'
    }
    if (!form.message.trim() || form.message.trim().length < 20) {
      newErrors.message = 'Please provide at least 20 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError('')
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await apiRequest<EnquiryResponse>('/api/enquiries', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', enquiry: '', message: '' })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send your enquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="overflow-hidden" ref={ref} aria-label="Commission or Contact">
      <motion.div
        className="flex flex-col lg:flex-row min-h-[560px]"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7 }}
      >
        {/* Left panel â€” dark */}
        <div
          className="flex-1 flex flex-col justify-center px-8 py-16 md:px-16"
          style={{ background: '#162540' }}
        >
          <div className="section-label mb-6">Speak with a Curator</div>
          <h2
            className="font-display font-light text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Commission Your{' '}
            <span className="font-semibold" style={{ color: '#1CB8D2' }}>Piece</span>
          </h2>
          <p className="font-sans leading-relaxed mb-8 max-w-sm" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.55)' }}>
            Whether you seek a bespoke commission, a specific sculpture, or simply expert guidance
            on building your collection â€” our curators are here.
          </p>

          <div className="space-y-3 mb-8">
            {['Bespoke Commissions', 'Purchase Enquiries', 'Collection Guidance', 'Valuations'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1CB8D2' }} />
                <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary self-start"
          >
            <MessageCircle size={14} />
            WhatsApp Us
          </a>

          <p className="font-sans text-[11px] mt-4 tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
            We respond within 24 hours
          </p>
        </div>

        {/* Right panel â€” cyan */}
        <div
          className="flex-1 flex flex-col justify-center px-8 py-16 md:px-16"
          style={{ background: '#1CB8D2' }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle size={48} className="mx-auto mb-5 text-white" />
              <h3 className="font-display text-3xl text-white mb-2" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                Message Received
              </h3>
              <p className="font-sans text-sm text-white/75">
                A curator will contact you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <h3 className="font-display font-semibold text-white text-2xl mb-6" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                Send an Enquiry
              </h3>

              {submitError && (
                <div className="flex items-start gap-3 px-4 py-3 font-sans text-sm text-red-100 bg-red-900/30 rounded-lg border border-red-400/30" role="alert">
                  <AlertCircle size={16} className="mt-0.5 flex-none" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Your Name *"
                    className="w-full px-4 py-3 font-sans text-sm outline-none rounded-lg transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: errors.name ? '2px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                      color: '#FFFFFF',
                    }}
                  />
                  {errors.name && <p className="mt-1 font-sans text-[11px] text-white/80">{errors.name}</p>}
                </div>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3 font-sans text-sm outline-none rounded-lg transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: errors.email ? '2px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                      color: '#FFFFFF',
                    }}
                  />
                  {errors.email && <p className="mt-1 font-sans text-[11px] text-white/80">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Phone / WhatsApp"
                  className="w-full px-4 py-3 font-sans text-sm outline-none rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', color: '#FFFFFF' }}
                />
                <select
                  name="enquiry"
                  value={form.enquiry}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 font-sans text-sm outline-none appearance-none cursor-pointer rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', color: form.enquiry ? '#FFFFFF' : 'rgba(255,255,255,0.7)' }}
                >
                  <option value="" disabled style={{ color: '#162540' }}>Enquiry Type</option>
                  {enquiryTypes.map((t) => (
                    <option key={t.value} value={t.value} style={{ color: '#162540', background: '#fff' }}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Your message â€” describe what you're looking for..."
                  className="w-full px-4 py-3 font-sans text-sm outline-none resize-none rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: errors.message ? '2px solid #fff' : '2px solid rgba(255,255,255,0.3)',
                    color: '#FFFFFF',
                  }}
                />
                {errors.message && <p className="mt-1 font-sans text-[11px] text-white/80">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-dark w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed rounded-lg"
              >
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}

