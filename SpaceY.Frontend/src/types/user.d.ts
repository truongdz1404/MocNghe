export interface User {
    username: string;
    email: string;
    avatarUrl: string;
    role: string;
}

export interface CreateUser {
    userName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role?: Role.CUSTOMER
}

interface UpdateUser {
    username?: string;
    email?: string;
    phoneNumber?: string;
    avatarUrl?: string;
}


export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
