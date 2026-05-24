import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { apiRequest, getUserToken, setUserToken, clearUserToken } from '../lib/api'

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = getUserToken()
    if (!storedToken) {
      setIsLoading(false)
      return
    }

    apiRequest<{ user: AuthUser & { _id?: string } }>('/api/auth/me', {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(({ user: fetched }) => {
        setUser({ id: fetched.id ?? String(fetched._id), name: fetched.name, email: fetched.email })
        setToken(storedToken)
      })
      .catch(() => {
        clearUserToken()
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = (newToken: string, newUser: AuthUser) => {
    setUserToken(newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    clearUserToken()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
