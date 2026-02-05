'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api, { authAPI } from '../services/api';

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

    const login = useCallback(async (username, password) => {
        try {
            let account = null;

            // First try the backend auth API
            try {
                const response = await authAPI.login({ username, password });
                const userData = response.data?.user || response.data?.data || response.data;

                if (userData && userData.username) {
                    account = {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        isActive: userData.isActive !== false
                    };

                    // Store token if provided
                    if (response.data?.token) {
                        localStorage.setItem('token', response.data.token);
                    }
                }
            } catch (apiError) {
                console.log('Auth API not available, using fallback...', apiError.message);
            }

            // Fallback: Test default accounts from guide
            if (!account) {
                if (username === 'superadmin' && password === 'SuperAdmin@123') {
                    account = { id: 1, username: 'superadmin', role: 'superadmin', isActive: true };
                } else if (username === 'admin' && password === 'admin') {
                    account = { id: 2, username: 'admin', role: 'admin', isActive: true };
                } else if (username === 'teacher' && password === 'teacher') {
                    account = { id: 3, username: 'teacher', role: 'teacher', isActive: true };
                } else {
                    // Fallback to fetching all accounts (legacy)
                    try {
                        const response = await api.get('/accounts');
                        const accounts = Array.isArray(response.data) ? response.data : (response.data?.data || []);
                        account = accounts.find(acc => acc.username === username && acc.isActive);
                    } catch (e) {
                        console.error("Accounts API error", e);
                    }
                }
            }

            if (account) {
                // Set user state and localStorage
                setUser(account);
                localStorage.setItem('user', JSON.stringify(account));

                // Use window.location for reliable redirect
                window.location.href = '/dashboard';
                return { success: true };
            }

            return { success: false, error: 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            // Try to call logout API
            await authAPI.logout().catch(() => { });
        } catch (e) { /* ignore */ }

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    }, [router]);

    const hasRole = useCallback((roles) => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    }, [user]);

    const value = {
        user,
        login,
        logout,
        loading,
        hasRole,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
