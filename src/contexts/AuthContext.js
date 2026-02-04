'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            let account = null;
            if (username === 'superadmin' && password === 'SuperAdmin@123') {
                account = { username: 'superadmin', role: 'superadmin', isActive: true };
                // Test default accounts from guide
            } else if (username === 'admin' && password === 'admin') {
                account = { username: 'admin', role: 'admin', isActive: true };
            } else if (username === 'teacher' && password === 'teacher') {
                account = { username: 'teacher', role: 'teacher', isActive: true };
            } else {
                try {
                    // Fallback to API
                    const response = await api.get('/accounts');
                    const accounts = Array.isArray(response.data) ? response.data : (response.data.data || []);
                    account = accounts.find(acc => acc.username === username);
                } catch (e) { console.error("Login API error", e); }
            }

            if (account) {
                setUser(account);
                localStorage.setItem('user', JSON.stringify(account));

                router.push('/dashboard');

                return { success: true };
            }
            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    const hasRole = (roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
