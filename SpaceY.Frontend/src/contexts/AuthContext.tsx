'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthServices from '@/services/AuthServices';
import { LoginCredentials } from '@/types/auth';
import { AxiosError } from 'axios';
import { User } from '@/types/user';
// import { User } from '@/types/user';

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
    const [isInitialized, setIsInitialized] = useState<boolean>(false); // Thêm flag để tránh loop
    const router = useRouter();

    // Clear authentication state
    const clearAuthState = useCallback(async (): Promise<void> => {
        console.log('Clearing auth state');
        setUser(null);
        setIsAuthenticated(false);

        // Clear any local storage if needed (though cookies are handled by backend)
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            console.log('Local storage cleared');
        }
    }, []);

    // Refresh authentication
    const refreshAuth = useCallback(async (): Promise<void> => {
        try {
            const response = await AuthServices.RefreshToken();
            console.log('Refresh auth response:', response);

            if (response.status === 'Success') {
                // After refresh, check auth again to get user info
                const userResponse = await AuthServices.GetCurrentUser();
                if (userResponse.status === 'Success' && userResponse.data) {
                    setUser(userResponse.data);
                    setIsAuthenticated(true);
                }
            } else {
                throw new Error('Refresh failed');
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error('Refresh failed:', error);
            if (axiosError.response?.status === 401) {
                console.log('Unauthorized - Clearing auth state');
                await clearAuthState();
                // CHỈ redirect khi không phải đang ở trang login
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    router.push('/login');
                }
            } else {
                throw error;
            }
        }
    }, [clearAuthState, router]);

    // Check authentication status
    const checkAuth = useCallback(async () => {
        // Ngăn việc gọi checkAuth nhiều lần khi đã initialized
        if (isInitialized) {
            return;
        }

        console.log('checkAuth called');
        try {
            setIsLoading(true);
            const response = await AuthServices.GetCurrentUser();
            console.log('checkAuth response:', response);

            if (response.status === 'Success' && response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error: unknown) {
            console.error('Auth check failed:', error);
            const axiosError = error as AxiosError;
            // If 401, try to refresh token
            if (axiosError.response?.status === 401) {
                try {
                    await refreshAuth();
                } catch (refreshError) {
                    console.error('Refresh also failed:', refreshError);
                    await clearAuthState();
                }
            } else {
                await clearAuthState();
            }
        } finally {
            setIsLoading(false);
            setIsInitialized(true); // Đánh dấu đã initialize xong
        }
    }, [isInitialized, refreshAuth, clearAuthState]);

    // Login function
    const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await AuthServices.SignIn(credentials);

            if (response.status === 'Success' && response.data) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            await AuthServices.Logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await clearAuthState();
            setIsLoading(false);
            router.push('/login');
        }
    }, [clearAuthState, router]);

    // Initial auth check on mount - CHỈ chạy 1 lần
    useEffect(() => {
        if (!isInitialized) {
            checkAuth();
        }
    }, [checkAuth, isInitialized]);

    // Listen for storage events (if user logout in another tab)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'logout') {
                clearAuthState();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, [clearAuthState]);

    // Auto refresh token when it's about to expire (optional)
    // CHỈ setup khi đã authenticated và initialized
    useEffect(() => {
        if (!isAuthenticated || !isInitialized) return;

        // Set up auto refresh - check every 25 minutes
        const refreshInterval = setInterval(async () => {
            try {
                console.log('Auto refreshing token...');
                await refreshAuth();
            } catch (error) {
                console.error('Auto refresh failed:', error);
                // If auto refresh fails, let the user continue but they'll be logged out on next API call
            }
        }, 25 * 60 * 1000); // 25 minutes

        return () => clearInterval(refreshInterval);
    }, [isAuthenticated, isInitialized, refreshAuth]);

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
        const { isAuthenticated, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                // router.push('/login');
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