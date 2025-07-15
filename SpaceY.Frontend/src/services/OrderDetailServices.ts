import api from "@/services/api";
import { OrderDetailDto, UpdateOrderDetailDto } from "@/types/order";
import axios from "axios";

const GetOrderDetailsByOrderId = async (orderId: number): Promise<OrderDetailDto[]> => {
    const response = await api.get(`/api/OrderDetails/order/${orderId}`);
    return response.data.data;
};

const GetOrderDetailById = async (id: number): Promise<OrderDetailDto | null> => {
    try {
        const response = await api.get(`/api/OrderDetails/${id}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

const UpdateOrderDetail = async (
    id: number,
    updateOrderDetailDto: UpdateOrderDetailDto
): Promise<OrderDetailDto | null> => {
    try {
        const response = await api.put(`/api/OrderDetails/${id}`, updateOrderDetailDto);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

const DeleteOrderDetail = async (id: number): Promise<boolean> => {
    try {
        await api.delete(`/api/OrderDetails/${id}`);
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
};

const OrderDetailServices = {
    GetOrderDetailsByOrderId,
    GetOrderDetailById,
    UpdateOrderDetail,
    DeleteOrderDetail,
};

export default OrderDetailServices;