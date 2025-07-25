import { AddressDto } from "@/types/address";

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    role: string;
    phoneNumber?: string;
    address?: AddressDto[];
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
    id: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    avatarUrl?: string;
}


export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
