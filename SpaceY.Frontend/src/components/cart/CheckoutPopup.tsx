'use client'
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    Card,
    CardBody,
} from "@/components/ui/MaterialTailwind";
import { AddressDto } from '@/types/address';
import { CartItem } from '@/services/CartServices';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import addressService from '@/services/AddressServices';
import OrderServices from '@/services/OrderServices';
import { CreateOrderDto, CreateOrderDetailDto } from '@/types/order';

interface CheckoutPopupProps {
    open: boolean;
    onClose: () => void;
    selectedItems: CartItem[];
    totalAmount: number;
    subTotal: number;
    shippingCost: number;
}

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({
    open,
    onClose,
    selectedItems,
    totalAmount,
    subTotal,
    shippingCost
}) => {
    const [addresses, setAddresses] = useState<AddressDto[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [addressOption, setAddressOption] = useState<string>(''); // 'existing' or 'new'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!open) return;
        fetchAddresses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const addressList = await addressService.getAll();
            setAddresses(addressList);

            if (addressList.length === 0) {
                // Redirect to profile addresses if no addresses
                onClose();
                router.push('/profile/addresses');
                return;
            }

            // Set default to first address if available
            if (addressList.length > 0) {
                setSelectedAddressId(addressList[0].id.toString());
                setAddressOption('existing');
            }
        } catch (err) {
            setError('Không thể tải danh sách địa chỉ');
            console.error('Lỗi khi lấy địa chỉ:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddressOptionChange = (value: string) => {
        setAddressOption(value);
        if (value === 'new') {
            onClose();
            router.push('/profile/addresses');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getSelectedAddress = () => {
        return addresses.find(addr => addr.id.toString() === selectedAddressId);
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setError('Vui lòng chọn một địa chỉ');
            return;
        }

        const selectedAddress = getSelectedAddress();
        if (!selectedAddress) {
            setError('Địa chỉ đã chọn không tồn tại');
            return;
        }

        if (selectedItems.length === 0) {
            setError('Giỏ hàng trống. Vui lòng chọn ít nhất một sản phẩm.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Chuẩn bị dữ liệu đơn hàng
            const orderItems: CreateOrderDetailDto[] = selectedItems.map(item => {
                if (!item.productVariantId || item.quantity <= 0) {
                    throw new Error(`Dữ liệu sản phẩm không hợp lệ: ${item.productTitle}`);
                }

                return {
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                };
            });

            const createOrderDto: CreateOrderDto = {
                // userId: '9068cd0c-9dff-480e-a45c-f62d073660ae',
                orderItems: orderItems,
            };

            console.log('createOrderDto:', createOrderDto);
            // Gọi API tạo Order
            await OrderServices.CreateOrder(createOrderDto);

            // Chuyển hướng đến trang chi tiết đơn hàng
            onClose();
            // router.push(`/order/${createdOrder.id}`);
            router.push(`/order/orderHistory`);
        } catch (err) {
            setError('Không thể tạo đơn hàng. Vui lòng thử lại.');
            console.error('Lỗi khi tạo đơn hàng:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <Typography variant="h4" color="blue-gray">
                        Thanh Toán
                    </Typography>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={onClose}
                        className="p-2"
                    >
                        ✕
                    </Button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {/* Address Selection */}
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-3">
                                    Chọn Địa Chỉ Giao Hàng
                                </Typography>

                                <div className="mb-4">
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={addressOption}
                                        onChange={(e) => handleAddressOptionChange(e.target.value)}
                                    >
                                        <option value="">Chọn tùy chọn địa chỉ</option>
                                        <option value="existing">Chọn địa chỉ đã lưu</option>
                                        <option value="new">Thêm địa chỉ mới</option>
                                    </select>
                                </div>

                                {addressOption === 'existing' && addresses.length > 0 && (
                                    <div className="mt-4">
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={selectedAddressId}
                                            onChange={(e) => setSelectedAddressId(e.target.value)}
                                        >
                                            <option value="">Chọn địa chỉ</option>
                                            {addresses.map((address) => (
                                                <option key={address.id} value={address.id.toString()}>
                                                    {`${address.firstName} ${address.lastName} - ${address.street}, ${address.city}, ${address.state}`}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Selected Address Details */}
                                        {selectedAddressId && (
                                            <Card className="mt-3">
                                                <CardBody className="p-4">
                                                    {(() => {
                                                        const addr = getSelectedAddress();
                                                        return addr ? (
                                                            <div>
                                                                <Typography variant="h6" color="blue-gray">
                                                                    {addr.firstName} {addr.lastName}
                                                                </Typography>
                                                                <Typography color="gray">
                                                                    {addr.street}
                                                                </Typography>
                                                                <Typography color="gray">
                                                                    {addr.city}, {addr.state}
                                                                </Typography>
                                                                <Typography color="gray">
                                                                    {addr.phoneNumber}
                                                                </Typography>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </CardBody>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Selected Items */}
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-3">
                                    Sản Phẩm Đã Chọn ({selectedItems.length} sản phẩm)
                                </Typography>

                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {selectedItems.map((item) => (
                                        <Card key={item.productVariantId} className="overflow-hidden">
                                            <CardBody className="p-3">
                                                <div className="flex gap-3">
                                                    <Image
                                                        src={item.productImage || '/api/placeholder/60/60'}
                                                        alt={item.productTitle}
                                                        width={60}
                                                        height={60}
                                                        className="w-15 h-15 object-cover rounded"
                                                    />
                                                    <div className="flex-grow">
                                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                                            {item.productTitle}
                                                        </Typography>
                                                        <div className="flex gap-2 text-xs text-gray-600 mt-1">
                                                            {item.variantName && <span>{item.variantName}</span>}
                                                            {item.colorName && <span>• {item.colorName}</span>}
                                                            {item.sizeName && <span>• {item.sizeName}</span>}
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <Typography variant="small" color="gray">
                                                                Số lượng: {item.quantity}
                                                            </Typography>
                                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                                {formatCurrency(item.subTotal)}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <Card>
                                <CardBody className="p-4">
                                    <Typography variant="h6" color="blue-gray" className="mb-3">
                                        Tổng Đơn Hàng
                                    </Typography>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Typography color="gray">
                                                Tổng cộng ({selectedItems.length} sản phẩm):
                                            </Typography>
                                            <Typography color="blue-gray">
                                                {formatCurrency(subTotal)}
                                            </Typography>
                                        </div>
                                        <div className="flex justify-between">
                                            <Typography color="gray">Phí vận chuyển:</Typography>
                                            <Typography color="gray">
                                                {formatCurrency(shippingCost)}
                                            </Typography>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between">
                                            <Typography variant="h6" color="blue-gray">
                                                Tổng thanh toán:
                                            </Typography>
                                            <Typography variant="h6" color="blue-gray">
                                                {formatCurrency(totalAmount)}
                                            </Typography>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {error && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <Typography variant="small" color="red">
                                        {error}
                                    </Typography>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-2 p-6 border-t">
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        color="blue"
                        onClick={handleCheckout}
                        disabled={loading || !selectedAddressId}
                    >
                        Xác Nhận Thanh Toán
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPopup;