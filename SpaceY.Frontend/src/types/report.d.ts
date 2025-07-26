export interface OrderReport {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topProducts: {
        productId: number;
        productName: string;
        totalQuantity: number;
        totalRevenue: number;
    }[];
    dailyStats?: {
        day: number;
        orderCount: number;
        revenue: number;
    }[];
    monthlyStats?: {
        month: number;
        orderCount: number;
        revenue: number;
        averageOrderValue: number;
    }[];
}