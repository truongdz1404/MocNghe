interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token?: string;
    message?: string;
}