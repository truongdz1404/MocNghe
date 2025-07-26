import { OrderReport } from "@/types/report";
import api from "./api"



const getOrdersByMonth = async (year: number, month: number): Promise<OrderReport> => {
    const response = await api.get(`/report/orders/monthly?year=${year}&month=${month}`);
    return response.data;
}

const getOrdersByYear = async (year: number): Promise<OrderReport> => {
    const response = await api.get(`/report/orders/yearly?year=${year}`);
    return response.data;
}

const getOrdersByWeek = async (year: number, week: number): Promise<OrderReport> => {
    const response = await api.get(`/report/orders/weekly?year=${year}&week=${week}`);
    return response.data;
}

interface UserReport {
    total: number;
    users: {
        id: string;
        email: string;
        createdAt: string;
    }[];
}

const getUsersByMonth = async (year: number, month: number): Promise<UserReport> => {
    const response = await api.get(`/report/users/monthly?year=${year}&month=${month}`);
    return response.data;
}

const getUsersByYear = async (year: number): Promise<UserReport> => {
    const response = await api.get(`/report/users/yearly?year=${year}`);
    return response.data;
}

const getUsersByWeek = async (year: number, week: number): Promise<UserReport> => {
    const response = await api.get(`/report/users/weekly?year=${year}&week=${week}`);
    return response.data;
}

const ReportServices = {
    getOrdersByMonth,
    getOrdersByYear,
    getOrdersByWeek,
    getUsersByMonth,
    getUsersByYear,
    getUsersByWeek
}

export type { OrderReport, UserReport }
export default ReportServices