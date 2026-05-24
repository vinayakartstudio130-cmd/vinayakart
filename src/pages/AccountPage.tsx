import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle,
  KeyRound,
  LogOut,
  Package,
  ShoppingBag,
  User,
} from 'lucide-react'
import { userRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'

type Tab = 'orders' | 'profile' | 'security'

interface OrderProduct {
  _id: string
  name: string
  image: string
  material: string
  price: number
}

type OrderStatus = 'created' | 'pending_verification' | 'paid' | 'processing' | 'dispatched' | 'delivered' | 'cancelled' | 'failed'

interface Order {
  _id: string
  product?: OrderProduct
  amount: number
  currency: string
  status: OrderStatus
  upiTransactionId?: string
  createdAt: string
}

interface UserProfile {
  _id: string
  name: string
  email: string
  phone: string
  address: {
    line1: string
    city: string
    state: string
    pincode: string
  }
  createdAt: string
}

const STATUS_STYLES: Record<OrderStatus, { label: string; bg: string; color: string; icon: string }> = {
  created:              { label: 'Awaiting Payment',      bg: 'rgba(251,191,36,0.12)',  color: '#fcd34d', icon: '⏳' },
  pending_verification: { label: 'Verifying Payment',     bg: 'rgba(251,146,60,0.12)',  color: '#fdba74', icon: '🔍' },
  paid:                 { label: 'Payment Confirmed',      bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', icon: '✅' },
  processing:           { label: 'Processing',             bg: 'rgba(96,165,250,0.12)',  color: '#93c5fd', icon: '⚙️' },
  dispatched:           { label: 'Dispatched',             bg: 'rgba(167,139,250,0.12)', color: '#c4b5fd', icon: '🚚' },
  delivered:            { label: 'Delivered',              bg: 'rgba(16,185,129,0.15)',  color: '#6ee7b7', icon: '📦' },
  cancelled:            { label: 'Cancelled',              bg: 'rgba(220,60,60,0.12)',   color: '#fca5a5', icon: '✕' },
  failed:               { label: 'Payment Failed',         bg: 'rgba(220,60,60,0.12)',   color: '#fca5a5', icon: '✕' },
}

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

function inputClass() {
  return 'w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/25 outline-none transition-all'
}

function inputStyle(focused = false) {
  return {
    background: 'rgba(255,255,255,0.06)',
    border: `1px solid ${focused ? 'rgba(28,184,210,0.6)' : 'rgba(28,184,210,0.2)'}`,
  }
}

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('orders')

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwBusy, setPwBusy] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/account' }, replace: true }); return }

    userRequest<{ orders: Order[] }>('/api/orders/my')
      .then(({ orders: o }) => setOrders(o))
      .catch((err) => setOrdersError(err instanceof Error ? err.message : 'Failed to load orders.'))
      .finally(() => setOrdersLoading(false))

    userRequest<{ user: UserProfile }>('/api/auth/me')
      .then(({ user: u }) => {
        setProfile(u)
        setProfileForm({
          name: u.name,
          phone: u.phone || '',
          line1: u.address?.line1 || '',
          city: u.address?.city || '',
          state: u.address?.state || '',
          pincode: u.address?.pincode || '',
        })
      })
      .catch(() => {})
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    setProfileError('')
    setProfileBusy(true)
    try {
      const { user: updated } = await userRequest<{ user: UserProfile }>('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          address: { line1: profileForm.line1, city: profileForm.city, state: profileForm.state, pincode: profileForm.pincode },
        }),
      })
      setProfile(updated)
      setProfileMsg('Profile updated successfully.')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setProfileBusy(false)
    }
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    setPwMsg('')
    setPwError('')
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    if (pwForm.newPassword.length < 8) { setPwError('New password must be at least 8 characters.'); return }
    setPwBusy(true)
    try {
      await userRequest('/api/auth/me/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      })
      setPwMsg('Password changed successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Password change failed.')
    } finally {
      setPwBusy(false)
    }
  }

  const tabs: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
    { key: 'orders', label: 'My Orders', icon: <ShoppingBag size={15} /> },
    { key: 'profile', label: 'Profile', icon: <User size={15} /> },
    { key: 'security', label: 'Security', icon: <KeyRound size={15} /> },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#162540' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{ background: 'rgba(22,37,64,0.97)', borderBottom: '1px solid rgba(28,184,210,0.15)' }}
      >
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ border: '2px solid #1CB8D2' }}
            >
              <span className="font-bold text-base leading-none" style={{ color: '#1CB8D2', fontFamily: 'Montserrat Alternates, sans-serif' }}>V</span>
            </div>
            <span className="text-white font-semibold hidden sm:block" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>VinayakArt</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-white/40 text-xs mt-0.5">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all"
              style={{ color: '#1CB8D2', border: '1px solid rgba(28,184,210,0.3)' }}
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1
            className="text-3xl font-semibold text-white mb-1"
            style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}
          >
            My Account
          </h1>
          <p className="text-white/40 text-sm mb-8">Manage your orders and profile</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={
                  tab === t.key
                    ? { background: '#1CB8D2', color: '#162540' }
                    : { color: 'rgba(255,255,255,0.5)' }
                }
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              {ordersLoading && (
                <div className="text-white/40 text-sm">Loading orders...</div>
              )}
              {ordersError && (
                <div className="flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(220,60,60,0.12)', color: '#fca5a5', border: '1px solid rgba(220,60,60,0.3)' }}>
                  <AlertCircle size={14} /> {ordersError}
                </div>
              )}
              {!ordersLoading && orders.length === 0 && !ordersError && (
                <div
                  className="rounded-2xl p-12 text-center"
                  style={{ background: '#1D3050', border: '1px solid rgba(28,184,210,0.15)' }}
                >
                  <Package size={36} className="mx-auto mb-4" style={{ color: 'rgba(28,184,210,0.4)' }} />
                  <p className="text-white/60 text-sm">No orders yet.</p>
                  <a
                    href="/#sculptures"
                    className="inline-block mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase"
                    style={{ background: '#1CB8D2', color: '#162540' }}
                  >
                    Browse Sculptures
                  </a>
                </div>
              )}
              <div className="space-y-4">
                {orders.map((order) => {
                  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.created

                  return (
                    <motion.article
                      key={order._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl overflow-hidden"
                      style={{ background: '#1D3050', border: '1px solid rgba(28,184,210,0.15)' }}
                    >
                      <div className="flex gap-4 p-5">
                        {order.product?.image && (
                          <img
                            src={order.product.image}
                            alt={order.product.name}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="text-white font-semibold text-base leading-tight" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                                {order.product?.name ?? 'Product unavailable'}
                              </h3>
                              {order.product?.material && (
                                <p className="text-white/40 text-xs mt-0.5">{order.product.material}</p>
                              )}
                            </div>
                            <span
                              className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 flex items-center gap-1.5"
                              style={{ background: st.bg, color: st.color }}
                            >
                              <span>{st.icon}</span>
                              {st.label}
                            </span>
                          </div>
                          <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
                            <div>
                              <p className="text-[#1CB8D2] font-bold">{INR.format(order.amount)}</p>
                              <p className="text-white/30 text-xs mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            {order.upiTransactionId && (
                              <p className="text-white/30 text-xs font-mono">
                                UTR: {order.upiTransactionId}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {tab === 'profile' && profile && (
            <div
              className="rounded-2xl p-6 md:p-8 max-w-lg"
              style={{ background: '#1D3050', border: '1px solid rgba(28,184,210,0.15)' }}
            >
              <h2 className="text-lg font-semibold text-white mb-5" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                Personal Information
              </h2>

              {profileMsg && (
                <div className="mb-4 flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={14} /> {profileMsg}
                </div>
              )}
              {profileError && (
                <div className="mb-4 flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(220,60,60,0.12)', color: '#fca5a5', border: '1px solid rgba(220,60,60,0.3)' }}>
                  <AlertCircle size={14} /> {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                {([
                  ['name', 'Full Name', 'text', true],
                  ['phone', 'Phone / WhatsApp', 'tel', false],
                ] as const).map(([field, label, type, required]) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={profileForm[field]}
                      onChange={(e) => setProfileForm((p) => ({ ...p, [field]: e.target.value }))}
                      required={required}
                      className={inputClass()}
                      style={inputStyle()}
                      onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
                      onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className={inputClass() + ' opacity-50 cursor-not-allowed'}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(28,184,210,0.1)' }}
                  />
                </div>

                <p className="text-xs font-semibold tracking-widest uppercase text-white/30 pt-2">Delivery Address</p>

                {([
                  ['line1', 'Address Line 1'],
                  ['city', 'City'],
                  ['state', 'State'],
                  ['pincode', 'PIN Code'],
                ] as const).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={profileForm[field]}
                      onChange={(e) => setProfileForm((p) => ({ ...p, [field]: e.target.value }))}
                      className={inputClass()}
                      style={inputStyle()}
                      onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
                      onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={profileBusy}
                  className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all disabled:opacity-50 mt-2"
                  style={{ background: '#1CB8D2', color: '#162540' }}
                >
                  {profileBusy ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div
              className="rounded-2xl p-6 md:p-8 max-w-lg"
              style={{ background: '#1D3050', border: '1px solid rgba(28,184,210,0.15)' }}
            >
              <h2 className="text-lg font-semibold text-white mb-5" style={{ fontFamily: 'Montserrat Alternates, sans-serif' }}>
                Change Password
              </h2>

              {pwMsg && (
                <div className="mb-4 flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={14} /> {pwMsg}
                </div>
              )}
              {pwError && (
                <div className="mb-4 flex items-center gap-2 text-sm rounded-lg px-4 py-3" style={{ background: 'rgba(220,60,60,0.12)', color: '#fca5a5', border: '1px solid rgba(220,60,60,0.3)' }}>
                  <AlertCircle size={14} /> {pwError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {([
                  ['currentPassword', 'Current Password'],
                  ['newPassword', 'New Password'],
                  ['confirm', 'Confirm New Password'],
                ] as const).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1.5">
                      {label}
                    </label>
                    <input
                      type="password"
                      value={pwForm[field]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
                      placeholder="••••••••"
                      required
                      className={inputClass()}
                      style={inputStyle()}
                      onFocus={(e) => Object.assign(e.currentTarget.style, inputStyle(true))}
                      onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle(false))}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={pwBusy}
                  className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider uppercase transition-all disabled:opacity-50 mt-2"
                  style={{ background: '#1CB8D2', color: '#162540' }}
                >
                  {pwBusy ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
