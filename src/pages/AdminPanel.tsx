import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  Inbox,
  LogOut,
  Package,
  ReceiptText,
  Save,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { adminRequest, apiRequest, clearAdminToken, getAdminToken, setAdminToken } from '../lib/api'

interface AdminSummary {
  products: number
  enquiries: number
  newEnquiries: number
  paidOrders: number
}

interface Product {
  _id: string
  name: string
  slug: string
  material: string
  category: string
  price: number
  dimensions: string
  image: string
  badge?: string
  badgeColor: 'gold' | 'stone' | 'red'
  stock: number
  isActive: boolean
}

interface Enquiry {
  _id: string
  name: string
  email: string
  phone?: string
  enquiry?: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  createdAt: string
}

type OrderStatus = 'created' | 'pending_verification' | 'paid' | 'processing' | 'dispatched' | 'delivered' | 'cancelled' | 'failed'

const ORDER_STATUSES: Array<{ value: OrderStatus; label: string }> = [
  { value: 'pending_verification', label: 'Pending Verification' },
  { value: 'created', label: 'Awaiting Payment' },
  { value: 'paid', label: 'Payment Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'failed', label: 'Failed' },
]

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_verification: '#fb923c',
  created: '#fbbf24',
  paid: '#34d399',
  processing: '#60a5fa',
  dispatched: '#a78bfa',
  delivered: '#34d399',
  cancelled: '#f87171',
  failed: '#f87171',
}

interface Order {
  _id: string
  product?: Product
  customer: {
    name: string
    email: string
    phone?: string
  }
  amount: number
  currency: string
  status: OrderStatus
  upiTransactionId?: string
  razorpayPaymentId?: string
  createdAt: string
}

const emptyProduct = {
  name: '',
  material: '',
  category: 'stone',
  price: '',
  dimensions: '',
  image: '',
  badge: '',
  badgeColor: 'gold',
  stock: '1',
}

const summaryCards: Array<[string, keyof AdminSummary, LucideIcon]> = [
  ['Products', 'products', Package],
  ['Enquiries', 'enquiries', Inbox],
  ['New Leads', 'newEnquiries', CheckCircle],
  ['Paid Orders', 'paidOrders', ReceiptText],
]

export default function AdminPanel() {
  const [token, setToken] = useState(getAdminToken() || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'products' | 'enquiries' | 'orders'>('products')
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [productForm, setProductForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const isLoggedIn = Boolean(token)

  const currency = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    [],
  )

  const loadAdminData = async () => {
    const [summaryData, productData, enquiryData, orderData] = await Promise.all([
      adminRequest<AdminSummary>('/api/admin/summary'),
      adminRequest<{ products: Product[] }>('/api/admin/products'),
      adminRequest<{ enquiries: Enquiry[] }>('/api/admin/enquiries'),
      adminRequest<{ orders: Order[] }>('/api/admin/orders'),
    ])

    setSummary(summaryData)
    setProducts(productData.products)
    setEnquiries(enquiryData.enquiries)
    setOrders(orderData.orders)
  }

  useEffect(() => {
    if (!isLoggedIn) return

    loadAdminData().catch((loadError) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load admin data.')
      clearAdminToken()
      setToken('')
    })
  }, [isLoggedIn])

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setIsBusy(true)

    try {
      const response = await apiRequest<{ token: string }>('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAdminToken(response.token)
      setToken(response.token)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.')
    } finally {
      setIsBusy(false)
    }
  }

  const handleLogout = () => {
    clearAdminToken()
    setToken('')
  }

  const resetProductForm = () => {
    setProductForm(emptyProduct)
    setEditingId('')
  }

  const handleProductSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsBusy(true)

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
    }

    try {
      if (editingId) {
        await adminRequest(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await adminRequest('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      setMessage(editingId ? 'Product updated.' : 'Product created.')
      resetProductForm()
      await loadAdminData()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save product.')
    } finally {
      setIsBusy(false)
    }
  }

  const editProduct = (product: Product) => {
    setEditingId(product._id)
    setProductForm({
      name: product.name,
      material: product.material,
      category: product.category,
      price: String(product.price),
      dimensions: product.dimensions,
      image: product.image,
      badge: product.badge || '',
      badgeColor: product.badgeColor,
      stock: String(product.stock),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const archiveProduct = async (productId: string) => {
    setError('')
    await adminRequest(`/api/admin/products/${productId}`, { method: 'DELETE' })
    await loadAdminData()
  }

  const updateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    await adminRequest(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
    await loadAdminData()
  }

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setError('')
    try {
      await adminRequest(`/api/admin/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status.')
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] px-6 py-16 text-[#F5F0E8]">
        <section className="mx-auto max-w-md border border-[#D4AF37]/20 bg-[#141210] p-8">
          <p className="section-label mb-5">Private Access</p>
          <h1 className="mb-3 font-display text-4xl">Admin Login</h1>
          <p className="mb-8 text-sm text-[#F5F0E8]/50">
            Manage products, enquiries, and payments for VinayakArt.
          </p>
          {error && (
            <div className="mb-5 flex gap-2 border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              className="w-full border border-[#D4AF37]/20 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full border border-[#D4AF37]/20 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
              required
            />
            <button className="btn-gold w-full justify-center" disabled={isBusy}>
              {isBusy ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#F5F0E8]">
      <header className="border-b border-[#D4AF37]/15 bg-[#0a0a0a] px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="section-label mb-2">VinayakArt</p>
            <h1 className="font-display text-3xl">Admin Console</h1>
          </div>
          <button onClick={handleLogout} className="btn-ghost-gold">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {summary && (
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {summaryCards.map(([label, key, Icon]) => (
              <div key={label} className="border border-[#D4AF37]/15 bg-[#141210] p-5">
                <Icon size={18} className="mb-4 text-[#D4AF37]" />
                <p className="text-3xl font-semibold">{summary[key]}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#F5F0E8]/40">{String(label)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ['products', 'Products'],
            ['enquiries', 'Enquiries'],
            ['orders', 'Orders'],
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-5 py-3 text-xs uppercase tracking-[0.16em] ${
                activeTab === tab
                  ? 'bg-[#D4AF37] text-[#0a0a0a]'
                  : 'border border-[#D4AF37]/20 text-[#D4AF37]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-5 border border-emerald-400/30 bg-emerald-950/30 p-3 text-sm text-emerald-100">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-5 border border-red-400/30 bg-red-950/30 p-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
            <form
              onSubmit={handleProductSubmit}
              className="h-fit border border-[#D4AF37]/15 bg-[#141210] p-5"
            >
              <h2 className="mb-5 font-display text-2xl">
                {editingId ? 'Edit Product' : 'Add Product'}
              </h2>
              <div className="space-y-3">
                {[
                  ['name', 'Product name'],
                  ['material', 'Material'],
                  ['category', 'Category'],
                  ['price', 'Price'],
                  ['dimensions', 'Dimensions'],
                  ['image', 'Image URL'],
                  ['badge', 'Badge'],
                  ['stock', 'Stock'],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={productForm[key as keyof typeof productForm]}
                    onChange={(event) =>
                      setProductForm((previous) => ({
                        ...previous,
                        [key]: event.target.value,
                      }))
                    }
                    placeholder={label}
                    type={key === 'price' || key === 'stock' ? 'number' : 'text'}
                    className="w-full border border-[#D4AF37]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
                    required={['name', 'material', 'category', 'price', 'image'].includes(key)}
                  />
                ))}
                <select
                  value={productForm.badgeColor}
                  onChange={(event) =>
                    setProductForm((previous) => ({
                      ...previous,
                      badgeColor: event.target.value,
                    }))
                  }
                  className="w-full border border-[#D4AF37]/15 bg-[#0a0a0a] px-4 py-3 text-sm outline-none"
                >
                  <option value="gold">Gold badge</option>
                  <option value="red">Red badge</option>
                  <option value="stone">Stone badge</option>
                </select>
              </div>
              <div className="mt-5 flex gap-3">
                <button className="btn-gold" disabled={isBusy}>
                  <Save size={14} />
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetProductForm} className="btn-ghost-gold">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="grid gap-4">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="grid gap-4 border border-[#D4AF37]/15 bg-[#141210] p-4 md:grid-cols-[120px_1fr_auto]"
                >
                  <img src={product.image} alt="" className="h-28 w-full object-cover md:w-28" />
                  <div>
                    <h3 className="font-display text-2xl">{product.name}</h3>
                    <p className="text-sm text-[#F5F0E8]/50">
                      {product.material} | {product.category} | Stock {product.stock}
                    </p>
                    <p className="mt-2 text-[#D4AF37]">{currency.format(product.price)}</p>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button onClick={() => editProduct(product)} className="btn-ghost-gold">
                      Edit
                    </button>
                    <button onClick={() => archiveProduct(product._id)} className="btn-ghost-gold">
                      Archive
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="grid gap-4">
            {enquiries.map((enquiry) => (
              <article key={enquiry._id} className="border border-[#D4AF37]/15 bg-[#141210] p-5">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl">{enquiry.name}</h3>
                    <p className="text-sm text-[#F5F0E8]/50">
                      {enquiry.email} {enquiry.phone ? `| ${enquiry.phone}` : ''}
                    </p>
                  </div>
                  <select
                    value={enquiry.status}
                    onChange={(event) =>
                      updateEnquiryStatus(enquiry._id, event.target.value as Enquiry['status'])
                    }
                    className="border border-[#D4AF37]/15 bg-[#0a0a0a] px-3 py-2 text-sm"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <p className="text-sm leading-6 text-[#F5F0E8]/70">{enquiry.message}</p>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid gap-4">
            {orders.map((order) => {
              const isPending = order.status === 'pending_verification'
              return (
                <article
                  key={order._id}
                  className="border bg-[#141210] p-5"
                  style={{
                    borderColor: isPending ? 'rgba(251,146,60,0.5)' : 'rgba(212,175,55,0.15)',
                    boxShadow: isPending ? '0 0 0 1px rgba(251,146,60,0.2)' : 'none',
                  }}
                >
                  {isPending && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded text-xs font-semibold" style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c' }}>
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block" />
                      Awaiting payment verification
                    </div>
                  )}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-2xl">
                        {order.product?.name || 'Product unavailable'}
                      </h3>
                      <p className="text-sm text-[#F5F0E8]/50 mt-0.5">
                        {order.customer.name} · {order.customer.email}
                        {order.customer.phone ? ` · ${order.customer.phone}` : ''}
                      </p>

                      {/* UPI Transaction ID — highlighted for pending verification */}
                      {order.upiTransactionId && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono"
                          style={{
                            background: isPending ? 'rgba(251,146,60,0.1)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isPending ? 'rgba(251,146,60,0.3)' : 'rgba(255,255,255,0.1)'}`,
                            color: isPending ? '#fb923c' : '#F5F0E8',
                          }}
                        >
                          <span className="text-[#F5F0E8]/40 font-sans not-italic">UTR:</span>
                          {order.upiTransactionId}
                        </div>
                      )}

                      {order.razorpayPaymentId && (
                        <p className="text-xs text-[#F5F0E8]/30 font-mono mt-1">{order.razorpayPaymentId}</p>
                      )}

                      <p className="text-xs text-[#F5F0E8]/30 mt-1.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <p className="text-[#D4AF37] font-semibold">{currency.format(order.amount)}</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value as OrderStatus)}
                        className="border bg-[#0a0a0a] px-3 py-1.5 text-xs font-semibold uppercase tracking-widest outline-none cursor-pointer"
                        style={{
                          borderColor: `${ORDER_STATUS_COLORS[order.status]}40`,
                          color: ORDER_STATUS_COLORS[order.status],
                        }}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value} style={{ color: ORDER_STATUS_COLORS[s.value] }}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </article>
              )
            })}
            {orders.length === 0 && (
              <div className="border border-[#D4AF37]/15 bg-[#141210] p-8 text-center text-[#F5F0E8]/50">
                <ShoppingBag className="mx-auto mb-3 text-[#D4AF37]" />
                No orders yet.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

