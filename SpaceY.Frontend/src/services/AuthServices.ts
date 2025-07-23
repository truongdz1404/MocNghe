// services/auth.ts
import api from "@/services/api";
import { LoginCredentials, LoginResponse } from "@/types/auth";
import { ResponseWith } from "@/types/response";
import { CreateUser, User } from "@/types/user";

const SignIn = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

const SignUp = async (user: CreateUser) => {
    const response = await api.post('/auth/register', user);
    return response.data;
};

const Logout = async () => {
    const response = await api.post('/auth/logout');
    // Cookies sẽ được clear bởi backend
    return response.data;
};

const RefreshToken = async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
};

const GetCurrentUser = async (): Promise<ResponseWith<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
};

const AuthServices = {
    SignIn,
    SignUp,
    Logout,
    RefreshToken,
    GetCurrentUser,
}

export default AuthServices;