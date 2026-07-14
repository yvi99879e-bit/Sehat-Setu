import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredSession, loginUser, logoutUser, registerUser } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const session = getStoredSession()
    if (session) setUser(session.user)
    setInitializing(false)
  }, [])

  async function login(credentials) {
    const { user } = await loginUser(credentials)
    setUser(user)
    return user
  }

  async function register(details) {
    const { user } = await registerUser(details)
    setUser(user)
    return user
  }

  function logout() {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
