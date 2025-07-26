'use client';
import React, { useEffect, useState } from 'react';
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import OrderDetailServices from "@/services/OrderDetailServices";
import { OrderDto, OrderStatus, OrderDetailDto } from "@/types/order";
import Image from 'next/image';

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderDto | null;
}

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Pending:
            return "bg-amber-100 text-amber-800 border-amber-200";
        case OrderStatus.Completed:
            return "bg-green-100 text-green-800 border-green-200";
        case OrderStatus.Canceled:
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getStatusText = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Pending:
            return "Chờ xử lý";
        case OrderStatus.Completed:
            return "Hoàn thành";
        case OrderStatus.Canceled:
            return "Đã hủy";
        default:
            return status;
    }
};

const OrderDetailDashboard: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order }) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetailDto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            fetchOrderDetails();
        }
    }, [isOpen, order]);

    const fetchOrderDetails = async () => {
        if (!order) return;

        try {
            setLoading(true);
            const details = await OrderDetailServices.GetOrderDetailsByOrderId(order.id);
            console.log('Order Details:', details);
            setOrderDetails(details);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSubtotal = () => {
        return orderDetails.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    const handleClose = () => {
        setOrderDetails([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Modal */}
                <div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 p-6">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Chi tiết đơn hàng #{order?.id}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Đặt hàng lúc {order && format(new Date(order.createdAt), "HH:mm - dd/MM/yyyy")}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {order && (
                            <div className="space-y-6">
                                {/* Order Summary */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Thông tin đơn hàng
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Mã đơn hàng
                                                </p>
                                                <p className="text-sm text-gray-500 font-mono">
                                                    #{order.id}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Trạng thái
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Ngày tạo
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Ngày cập nhật
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(order.modifiedAt), "dd/MM/yyyy HH:mm")}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Số lượng sản phẩm
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.orderItems.length} sản phẩm
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Tổng tiền
                                                </p>
                                                <p className="text-lg font-bold text-blue-600">
                                                    {formatPrice(order.totalPrice)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Danh sách sản phẩm ({loading ? '...' : orderDetails.length})
                                        </h3>

                                        {loading ? (
                                            <div className="flex justify-center items-center py-8">
                                                <div className="animate-pulse flex space-x-4 w-full">
                                                    <div className="rounded-lg bg-gray-300 h-20 w-20"></div>
                                                    <div className="flex-1 space-y-2 py-1">
                                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : orderDetails.length > 0 ? (
                                            <div className="space-y-4">
                                                {orderDetails.map((item: OrderDetailDto) => (
                                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                        {/* Product Image */}
                                                        <div className="flex-shrink-0">
                                                            {item.product?.image2DUrl ? (
                                                                <Image
                                                                    src={item.product.image2DUrl}
                                                                    alt={item.product.title}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-16 h-16 rounded-lg border border-gray-300 object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                                        {item.product?.title || 'Tên sản phẩm'}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        ID Sản phẩm: #{item.productId}
                                                                    </p>
                                                                </div>
                                                                <p className="text-lg font-bold text-blue-600">
                                                                    {formatPrice(item.totalPrice)}
                                                                </p>
                                                            </div>

                                                            {/* Product Variant Info */}
                                                            {item.productVariant && (
                                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                                        <div>
                                                                            <p className="font-medium text-gray-700">
                                                                                Phân loại:
                                                                            </p>
                                                                            <p className="text-gray-500">
                                                                                {item.productVariant.productId || 'N/A'}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-700">
                                                                                Số lượng:
                                                                            </p>
                                                                            <p className="text-gray-500">
                                                                                {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-700">
                                                                                Đơn giá:
                                                                            </p>
                                                                            <p className="text-gray-500">
                                                                                {formatPrice(item.productVariant.price)}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-700">
                                                                                SKU:
                                                                            </p>
                                                                            <p className="text-gray-500">
                                                                                {item.productVariant.sku || 'N/A'}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Discount Info */}
                                                                    {/* {item.productVariant.hasDiscount && (
                                                                        <div className="mt-2 flex items-center gap-2">
                                                                            <span className="text-sm font-medium text-red-600">
                                                                                Giảm giá: {item.productVariant.discountPercent}%
                                                                            </span>
                                                                            <span className="text-sm text-gray-500 line-through">
                                                                                {formatPrice(item.productVariant.originalPrice)}
                                                                            </span>
                                                                        </div>
                                                                    )} */}
                                                                </div>
                                                            )}

                                                            {/* Product Stats */}
                                                            {item.product && (
                                                                <div className="flex gap-4 text-sm text-gray-500">
                                                                    <span>⭐ {item.product.averageRating.toFixed(1)} ({item.product.reviewCount} đánh giá)</span>
                                                                    <span>📦 Còn {item.product.totalStock} sản phẩm</span>
                                                                    {item.product.featured && <span>🔥 Nổi bật</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Order Total */}
                                                <div className="border-t border-gray-200 pt-4 mt-6">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-lg text-gray-900">
                                                            Tạm tính:
                                                        </p>
                                                        <p className="text-lg text-gray-900">
                                                            {formatPrice(calculateSubtotal())}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-xl font-bold text-gray-900">
                                                            Tổng cộng:
                                                        </p>
                                                        <p className="text-xl font-bold text-blue-600">
                                                            {formatPrice(order.totalPrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">
                                                    Không có thông tin chi tiết sản phẩm
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6">
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                In đơn hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailDashboard;