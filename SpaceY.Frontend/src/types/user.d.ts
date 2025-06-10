export interface User{
    username:string;
    email:string;
    avatarUrl: string;
    role: string;
    fullName:string;
}

export interface CreateUser{
    fullName:string;
    email:string;
    password:string;
    phoneNumber?:string;
    avatarUrl?:string;
    role?: Role.CUSTOMER
}

export enum Role{
    CUSTOMER = "Customer",
    ADMIN = "Admin"
}