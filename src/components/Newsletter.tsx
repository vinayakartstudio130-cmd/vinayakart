import { useState, useRef, FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { apiRequest } from '../lib/api'

type EnquiryType =
  | ''
  | 'commission'
  | 'purchase'
  | 'valuation'
  | 'wholesale'
  | 'press'

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

const chips = [
  'Sacred Idols',
  'Stone Sculptures',
  'Brass Works',
  'Terracotta Art',
  'Wood Carvings',
  'Custom Commission',
]

export default function Newsletter() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    enquiry: '',
    message: '',
  })
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await apiRequest<EnquiryResponse>('/api/enquiries', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setSubmitted(true)
      setForm({
        name: '',
        email: '',
        phone: '',
        enquiry: '',
        message: '',
      })
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to send your enquiry. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="py-20 md:py-28"
      style={{ background: '#111111' }}
      aria-label="Commission or Contact"
    >
      <div className="section-container" ref={ref}>
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Card */}
          <div
            className="relative overflow-hidden p-8 md:p-12"
            style={{
              background: '#141210',
              border: '1px solid rgba(201,168,76,0.12)',
            }}
          >
            {/* Gold top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: 'linear-gradient(90deg, #C9A84C, #F0D080, #C9A84C)' }}
            />

            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <span className="section-label">Speak with a Curator</span>
              </div>
              <h2
                className="font-display font-light text-[#F5F0E8] leading-[1.1] mb-3"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                }}
              >
                Commission Your <em style={{ color: '#C9A84C' }}>Piece</em>
              </h2>
              <p className="font-sans text-[0.875rem] text-[#F5F0E8]/45 max-w-md mx-auto leading-relaxed">
                Whether you seek a bespoke commission, a specific sculpture, or simply expert guidance
                on building your collection — our curators are here.
              </p>
            </div>

            {/* Interest chips */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="font-sans text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 text-[#F5F0E8]/50"
                  style={{
                    border: '1px solid rgba(201,168,76,0.2)',
                    background: 'rgba(201,168,76,0.04)',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="divider-gold mb-8" />

            {/* Form or Success */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle size={40} className="mx-auto mb-4" style={{ color: '#C9A84C' }} />
                <h3
                  className="font-display text-2xl text-[#F5F0E8] mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Message Received
                </h3>
                <p className="font-sans text-sm text-[#F5F0E8]/45">
                  A curator will contact you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {submitError && (
                  <div
                    className="flex items-start gap-3 px-4 py-3 font-sans text-sm text-red-200"
                    style={{
                      border: '1px solid rgba(248,113,113,0.35)',
                      background: 'rgba(127,29,29,0.18)',
                    }}
                    role="alert"
                  >
                    <AlertCircle size={16} className="mt-0.5 flex-none" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Your name"
                      className="w-full bg-[#0d0d0d] px-4 py-3 font-sans text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/20 outline-none transition-colors"
                      style={{
                        border: errors.name
                          ? '1px solid rgba(180,60,60,0.5)'
                          : '1px solid rgba(201,168,76,0.15)',
                      }}
                    />
                    {errors.name && (
                      <p className="mt-1 font-sans text-[11px] text-red-400/80">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="you@example.com"
                      className="w-full bg-[#0d0d0d] px-4 py-3 font-sans text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/20 outline-none transition-colors"
                      style={{
                        border: errors.email
                          ? '1px solid rgba(180,60,60,0.5)'
                          : '1px solid rgba(201,168,76,0.15)',
                      }}
                    />
                    {errors.email && (
                      <p className="mt-1 font-sans text-[11px] text-red-400/80">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone + Enquiry type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40 mb-2">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0d0d0d] px-4 py-3 font-sans text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/20 outline-none transition-colors"
                      style={{ border: '1px solid rgba(201,168,76,0.15)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="enquiry" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40 mb-2">
                      Enquiry Type
                    </label>
                    <select
                      id="enquiry"
                      name="enquiry"
                      value={form.enquiry}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full bg-[#0d0d0d] px-4 py-3 font-sans text-sm text-[#F5F0E8]/70 outline-none appearance-none cursor-pointer transition-colors"
                      style={{ border: '1px solid rgba(201,168,76,0.15)' }}
                    >
                      <option value="" disabled>Select type...</option>
                      {enquiryTypes.map((t) => (
                        <option key={t.value} value={t.value} className="bg-[#141210]">
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={4}
                    placeholder="Describe what you're looking for — piece, size, occasion, or anything you'd like our curators to know..."
                    className="w-full bg-[#0d0d0d] px-4 py-3 font-sans text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/20 outline-none resize-none transition-colors"
                    style={{
                      border: errors.message
                        ? '1px solid rgba(180,60,60,0.5)'
                        : '1px solid rgba(201,168,76,0.15)',
                    }}
                  />
                  {errors.message && (
                    <p className="mt-1 font-sans text-[11px] text-red-400/80">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="btn-gold w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                    {isSubmitting ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Send size={13} />
                    )}
                  </button>
                  <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#F5F0E8]/30">
                    We respond within 24 hours
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
