import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem('ff_token'))

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                setUser({ email: payload.sub, userId: payload.userId || null })
            } catch {
                setUser({ email: 'User' })
            }
        }
    }, [token])

    const login = (jwt) => {
        localStorage.setItem('ff_token', jwt)
        setToken(jwt)
    }

    const logout = () => {
        localStorage.removeItem('ff_token')
        localStorage.removeItem('ff_userId')
        setToken(null)
        setUser(null)
    }

    const userId = localStorage.getItem('ff_userId')

    return (
        <AuthContext.Provider value={{ user, token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
