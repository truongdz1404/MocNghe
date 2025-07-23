import { User, ChangePasswordRequest, CreateUser, UpdateUser } from "@/types/user"
import api from "./api"

const createUser = async (userData: CreateUser): Promise<User> => {
    const response = await api.post('/api/user', userData);
    return response.data;
}

const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get('/api/user');
    return response.data;
}

const getUserById = async (id: string): Promise<User> => {
    const response = await api.get(`/api/user/${id}`);
    return response.data;
}

const getUserByEmail = async (email: string): Promise<User> => {
    const response = await api.get(`/api/user/email/${email}`);
    return response.data;
}

const updateUser = async (id: string, userData: UpdateUser): Promise<User> => {
    const response = await api.put(`/api/user/${id}`, userData);
    return response.data;
}

const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/api/user/${id}`);
}

const changePassword = async (id: string, passwordData: ChangePasswordRequest): Promise<void> => {
    await api.post(`/api/user/${id}/change-password`, passwordData);
}

const UserServices = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    changePassword,
}

export default UserServices