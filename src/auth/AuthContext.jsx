import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    // UserResource might be nested or direct depending on UserResource implementation
                    const userData = response.data || response;
                    setUser(userData);
                    // If your backend returns verified_at or similar, you can set it here
                    // For now we assume if the user is fetched, they are somewhat valid
                    // but we'll check verification in ProtectedRoute if needed.
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('auth_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            localStorage.setItem('auth_token', data.access_token);
            const userData = data.user.data || data.user;
            setUser(userData);
            toast.success('Welcome back!');
            return data;
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error(error.response.data.message || 'Please verify your email.');
                throw error;
            }
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const data = await authService.register(formData);
            localStorage.setItem('auth_token', data.access_token);
            const userData = data.user.data || data.user;
            setUser(userData);
            toast.success('Registration successful! Please check your email for verification.');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            toast.success('Logged out successfully.');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            register, 
            logout,
            isAuthenticated: !!user,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
