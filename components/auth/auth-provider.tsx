"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  userName: string
  userId: string | null
  login: (userId: string, userName: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // 檢查 localStorage 中的登入狀態
    const savedUserId = localStorage.getItem("userId")
    const savedUserName = localStorage.getItem("userName")

    if (savedUserId && savedUserName) {
      setIsLoggedIn(true)
      setUserId(savedUserId)
      setUserName(savedUserName)
    }
  }, [])

  const login = (newUserId: string, newUserName: string) => {
    setIsLoggedIn(true)
    setUserId(newUserId)
    setUserName(newUserName)
    localStorage.setItem("userId", newUserId)
    localStorage.setItem("userName", newUserName)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserId(null)
    setUserName("")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
  }

  return <AuthContext.Provider value={{ isLoggedIn, userName, userId, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
