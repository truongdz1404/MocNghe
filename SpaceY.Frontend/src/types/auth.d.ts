// types/auth.ts
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    data: {
        user: User; // User info thay vì token
        isAuthenticated: boolean;
    };
    message: string;
}

export interface User {
    email: string;
    avata: string;
    // ... other user properties
}