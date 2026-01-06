import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for stored user data on mount
        const storedUser = localStorage.getItem('vendorstreet_user')
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error('Failed to parse user data:', error)
                localStorage.removeItem('vendorstreet_user')
            }
        }
        setLoading(false)
    }, [])

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('vendorstreet_user', JSON.stringify(userData))
        // We assume token might be inside userData or separate. 
        // If separate, typically we handle it. For now, matching App.jsx logic.
        if (userData.token) {
            localStorage.setItem('token', userData.token)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('vendorstreet_user')
        localStorage.removeItem('token')
    }

    const updateUser = (data) => {
        setUser(prev => {
            const newUser = { ...prev, ...data }
            localStorage.setItem('vendorstreet_user', JSON.stringify(newUser))
            return newUser
        })
    }

    const value = {
        user,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
