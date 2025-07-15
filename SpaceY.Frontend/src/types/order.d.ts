import { User } from "@/types/auth";
import { ProductDto } from "@/types/product";
import { ProductVariantDto } from "@/types/productVariant";

export enum OrderStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

export interface CreateOrderDetailDto {
    // productId: number;
    productVariantId: number;
    quantity: number;
}

export interface CreateOrderDto {
    userId?: string;
    orderItems: CreateOrderDetailDto[];
}

export interface CreateOrderItemDto {
    productVariantId: number;
    quantity: number;
}

export interface OrderDetailDto {
    id: number;
    orderId: number;
    productId: number;
    productVariantId: number;
    quantity: number;
    totalPrice: number;
    createdAt: string;
    modifiedAt: string;
    product?: ProductDto
    productVariant?: ProductVariantDto; // Replace with ProductVariantDto interface if available
}

export interface OrderDto {
    id: number;
    userId: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    modifiedAt: string;
    orderItems: OrderDetailDto[];
    user?: User; // Replace with UserDto interface if available
}

export interface OrderStatisticsDto {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    recentOrders: OrderDto[];
}

export interface OrderSummaryDto {
    id: number;
    userId: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    itemsCount: number;
}

export interface UpdateOrderDetailDto {
    quantity: number;
}

export interface UpdateOrderDto {
    status: OrderStatus;
}

export interface UpdateOrderStatusDto {
    status: OrderStatus;
}

export interface PaginatedData<T> {
    data: T[];
    totalCount: number;
  }