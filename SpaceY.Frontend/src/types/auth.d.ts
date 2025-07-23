import { User } from "@/types/user";

// types/auth.ts
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: User;
    };
    message: string;
}

// export interface User {
//     email: string;
//     avata: string;
//     username: string;
//     // ... other user properties
// }