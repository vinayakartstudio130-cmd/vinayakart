import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, UserPlus } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { useAuth, type AuthUser } from '../context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsBusy(true)
    try {
      const res = await apiRequest<{ token: string; user: AuthUser }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      login(res.token, res.user)
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: '#162540' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ border: '2px solid #1CB8D2' }}
            >
              <span
                className="font-bold text-xl leading-none"
                style={{ color: '#1CB8D2', fontFamily: 'Montserrat Alternates, sans-serif' }}
              >
                V
              </span>
            </div>
            <span
              className="text-white text-xl font-semibold"
              style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}
            >
              VinayakArt
            </span>
          </a>
          <h1
            className="text-3xl font-semibold text-white mb-2"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}
          >
            Create account
          </h1>
          <p className="text-white/50 text-sm">Join VinayakArt to track orders and more</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: '#1D3050', border: '1px solid rgba(28,184,210,0.2)' }}
        >
          {error && (
            <div
              className="mb-5 flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm"
              style={{ background: 'rgba(220,60,60,0.12)', border: '1px solid rgba(220,60,60,0.3)', color: '#fca5a5' }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {([
              ['name', 'Full Name', 'text', 'Your full name'],
              ['email', 'Email', 'email', 'you@example.com'],
              ['phone', 'Phone / WhatsApp', 'tel', '+91 98765 43210'],
            ] as const).map(([field, label, type, placeholder]) => (
              <div key={field}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                  {label}{field !== 'phone' && <span className="text-[#1CB8D2]"> *</span>}
                </label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={set(field)}
                  placeholder={placeholder}
                  required={field !== 'phone'}
                  className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(28,184,210,0.2)' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(28,184,210,0.6)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(28,184,210,0.2)')}
                />
              </div>
            ))}

            {(['password', 'confirm'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                  {field === 'password' ? 'Password' : 'Confirm Password'}
                  <span className="text-[#1CB8D2]"> *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form[field]}
                    onChange={set(field)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(28,184,210,0.2)' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(28,184,210,0.6)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(28,184,210,0.2)')}
                  />
                  {field === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all disabled:opacity-50 mt-2"
              style={{ background: '#1CB8D2', color: '#162540' }}
            >
              <UserPlus size={15} />
              {isBusy ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1CB8D2] hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          <a href="/" className="hover:text-white/50 transition-colors">
            ← Back to VinayakArt
          </a>
        </p>
      </motion.div>
    </div>
  )
}
