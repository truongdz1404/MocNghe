import api from "@/services/api";
import {
    OrderDto,
    CreateOrderDto,
    UpdateOrderDto,
    OrderSummaryDto,
    OrderStatus,
    PaginatedData,
} from "@/types/order";
import axios from "axios";

const GetAllOrders = async (): Promise<OrderDto[]> => {
    const response = await api.get("/Order");
    return response.data.data;
};

const GetPaginatedOrders = async (
    pageNumber: number = 1,
    pageSize: number = 10
): Promise<PaginatedData<OrderSummaryDto>> => {
    const response = await api.get("/Order/paginated", {
        params: { pageNumber, pageSize },
    });
    return response.data.data;
};

const GetOrderById = async (id: number): Promise<OrderDto | null> => {
    try {
        const response = await api.get(`/Order/${id}`);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

const GetOrdersByUser = async (): Promise<OrderDto[]> => {
    const response = await api.get(`/Order/user`);
    return response.data.data;
};

const GetOrdersByStatus = async (status: OrderStatus): Promise<OrderDto[]> => {
    const response = await api.get(`/Order/status/${status}`);
    return response.data.data;
};

export const CreateOrder = async (
    createOrderDto: CreateOrderDto
): Promise<OrderDto> => {
    try {
        const response = await api.post("/Order", createOrderDto);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage =
                error.response?.data?.message || "Unknown server error";

            throw new Error(errorMessage);
        }

        throw new Error("Failed to create order");
    }
  };

const UpdateOrderStatus = async (
    id: number,
    updateOrderDto: UpdateOrderDto
): Promise<OrderDto | null> => {
    try {
        const response = await api.put(`/Order/${id}/status`, updateOrderDto);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

const DeleteOrder = async (id: number): Promise<boolean> => {
    try {
        await api.delete(`/Order/${id}`);
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
};

const GetTotalRevenue = async (): Promise<number> => {
    const response = await api.get("/Order/revenue/total");
    return response.data.data.totalRevenue;
};

const GetRevenueByDateRange = async (
    startDate: Date,
    endDate: Date
): Promise<{ revenue: number; startDate: string; endDate: string }> => {
    const response = await api.get("/Order/revenue/range", {
        params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        },
    });
    return response.data.data;
};

const GetRecentOrders = async (count: number = 10): Promise<OrderSummaryDto[]> => {
    const response = await api.get("/Order/recent", {
        params: { count },
    });
    return response.data.data;
};

const OrderServices = {
    GetAllOrders,
    GetPaginatedOrders,
    GetOrderById,
    GetOrdersByUser,
    GetOrdersByStatus,
    CreateOrder,
    UpdateOrderStatus,
    DeleteOrder,
    GetTotalRevenue,
    GetRevenueByDateRange,
    GetRecentOrders,
};

export default OrderServices;