'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthServices from '@/services/AuthServices';
import { User } from '@/types/auth';
import { AxiosError } from 'axios';

// Types
// interface User {
//     id: string;
//     email: string;
//     name: string;
//     role?: string;
//     // Thêm các properties khác của user
// }

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    // Check authentication status
    const checkAuth = useCallback(async () => {
        console.log('checkAuth called');
        try {
            setIsLoading(true);
            const response = await AuthServices.GetCurrentUser();
            console.log('checkAuth response:', response);
            if (response.status === 'SUCCESS' && response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            await clearAuthState();
        } finally {
            setIsLoading(false);
        }
    }, []);
    // Login function
    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await AuthServices.SignIn(credentials);

            if (response.status === 'SUCCESS' && response.data) {
                setUser(response.data.user);
                setIsAuthenticated(true);

                // Optional: Redirect after successful login
                // router.push('/dashboard');
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            throw error; // Re-throw để component có thể handle error
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await AuthServices.Logout();
        } catch (error) {
            console.error('Logout error:', error);
            // Vẫn clear local state ngay cả khi API call thất bại
        } finally {
            await clearAuthState();
            setIsLoading(false);
            router.push('/login');
        }
    };

    // Clear authentication state
    const clearAuthState = async (): Promise<void> => {
        console.log('Clearing auth state');
        setUser(null);
        setIsAuthenticated(false);

        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            console.log('Tokens removed from localStorage');
        }
    };

    // Refresh authentication (sau khi refresh token)
    const refreshAuth = async (): Promise<void> => {
        try {
            const response = await AuthServices.RefreshToken();
            console.log('Refresh auth response:', response);
            if (response.status === 'SUCCESS') {
                await checkAuth();
            } else {
                throw new Error('Refresh failed');
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error('Refresh failed:', axiosError);
            if (axiosError.response?.status === 401) {
                console.log('Unauthorized - Logging out');
                await logout();
            } else {
                throw axiosError;
            }
          }
    };

    // Initial auth check on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Listen for storage events (nếu user logout ở tab khác)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'logout') {
                clearAuthState();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Auto refresh token when it's about to expire
    useEffect(() => {
        if (!isAuthenticated) return;
        // Tạm thời comment lại để kiểm tra
        // const refreshInterval = setInterval(async () => {
        //     try {
        //         await refreshAuth();
        //     } catch (error) {
        //         console.error('Auto refresh failed:', error);
        //     }
        // }, 25 * 60 * 1000);
        // return () => clearInterval(refreshInterval);
    }, [isAuthenticated]);

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
        refreshAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
) => {
    const AuthenticatedComponent = (props: P) => {
        const { isAuthenticated, isLoading
            // , user 
        } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, isLoading, router]);

        // Show loading while checking auth
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        // Don't render if not authenticated (will redirect)
        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

    return AuthenticatedComponent;
};

// Hook for protected pages (alternative to HOC)
export const useRequireAuth = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    return { isAuthenticated, isLoading };
};

export default AuthContext;