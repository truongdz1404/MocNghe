import api from "@/services/api";
import { CreateUser } from "@/types/user";


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
    return response.data;
};

const RefreshToken = async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
};

const AuthServices = {
    SignIn,
    SignUp,
    Logout,
    RefreshToken,
}

export default AuthServices;