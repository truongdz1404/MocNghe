'use client'
import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    CardBody,
    CardHeader,
    Typography,
    IconButton,
} from "@/components/ui/MaterialTailwind";
import cartServices, { CartSummary, CartItem } from '@/services/CartServices';
import Image from 'next/image';

const ViewCart: React.FC = () => {
    const [cartData, setCartData] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartServices.getCart();
            if (response.success) {
                setCartData(response.data);
                setError(null);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to load cart');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productVariantId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingItems(prev => new Set(prev).add(productVariantId));

            const response = await cartServices.updateCartItem({
                productVariantId,
                quantity: newQuantity
            });

            if (response.success) {
                await fetchCart(); // Refresh cart data
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to update cart item');
            console.error('Error updating cart item:', err);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productVariantId);
                return newSet;
            });
        }
    };

    const removeItem = async (productVariantId: number) => {
        try {
            setUpdatingItems(prev => new Set(prev).add(productVariantId));

            const response = await cartServices.removeFromCart(productVariantId);

            if (response.success) {
                await fetchCart(); // Refresh cart data
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to remove cart item');
            console.error('Error removing cart item:', err);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productVariantId);
                return newSet;
            });
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            const response = await cartServices.clearCart();

            if (response.success) {
                await fetchCart();
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to clear cart');
            console.error('Error clearing cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-4xl mx-auto m-6">
                <CardBody className="text-center py-12">
                    <Typography variant="h5" color="red" className="mb-4">
                        {error}
                    </Typography>
                    <Button onClick={fetchCart} color="blue">
                        Try Again
                    </Button>
                </CardBody>
            </Card>
        );
    }

    if (!cartData || cartData.items.length === 0) {
        return (
            <Card className="max-w-4xl mx-auto m-6">
                <CardBody className="text-center py-12">
                    <Typography variant="h4" color="blue-gray" className="mb-4">
                        Your Cart is Empty
                    </Typography>
                    <Typography color="gray" className="mb-6">
                        Looks like you havent added anything to your cart yet.
                    </Typography>
                    <Button color="blue">
                        Continue Shopping
                    </Button>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="mb-6">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h4" color="blue-gray">
                            Giỏ Hàng ({cartData.totalItems} sản phẩm)
                        </Typography>
                        <Button
                            variant="text"
                            color="red"
                            onClick={clearCart}
                            disabled={loading}
                        >
                            Xoá giỏ hàng
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartData.items.map((item: CartItem) => (
                        <Card key={item.productVariantId} className="overflow-hidden">
                            <CardBody className="p-4">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={item.productImage || '/api/placeholder/100/100'}
                                            alt={item.productTitle}
                                            width={100}
                                            height={100}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <Typography variant="h6" color="blue-gray" className="mb-1">
                                            {item.productTitle}
                                        </Typography>

                                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                                            {item.variantName && (
                                                <span>Variant: {item.variantName}</span>
                                            )}
                                            {item.colorName && (
                                                <span>Color: {item.colorName}</span>
                                            )}
                                            {item.sizeName && (
                                                <span>Size: {item.sizeName}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <Typography variant="h6" color="blue-gray">
                                                {formatCurrency(item.price)}
                                            </Typography>
                                            {item.originalPrice > item.price && (
                                                <Typography variant="small" color="gray" className="line-through">
                                                    {formatCurrency(item.originalPrice)}
                                                </Typography>
                                            )}
                                        </div>

                                        {/* Stock Status */}
                                        <div className="mb-3">
                                            {item.inStock ? (
                                                <Typography variant="small" color="green">
                                                    Còn lại ({item.availableStock} sản phẩm)
                                                </Typography>
                                            ) : (
                                                <Typography variant="small" color="red">
                                                   Hết Hàng
                                                </Typography>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconButton
                                                    size="sm"
                                                    variant="outlined"
                                                    disabled={item.quantity <= 1 || updatingItems.has(item.productVariantId)}
                                                    onClick={() => updateQuantity(item.productVariantId, item.quantity - 1)}
                                                >
                                                    -
                                                </IconButton>

                                                <Typography variant="h6" className="mx-3 min-w-[2rem] text-center">
                                                    {item.quantity}
                                                </Typography>

                                                <IconButton
                                                    size="sm"
                                                    variant="outlined"
                                                    disabled={item.quantity >= item.availableStock || updatingItems.has(item.productVariantId)}
                                                    onClick={() => updateQuantity(item.productVariantId, item.quantity + 1)}
                                                >
                                                    +
                                                </IconButton>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Typography variant="h6" color="blue-gray">
                                                    {formatCurrency(item.subTotal)}
                                                </Typography>

                                                <IconButton
                                                    size="sm"
                                                    color="red"
                                                    variant="text"
                                                    disabled={updatingItems.has(item.productVariantId)}
                                                    onClick={() => removeItem(item.productVariantId)}
                                                >
                                                    🗑️
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader floated={false} shadow={false} className="rounded-none">
                            <Typography variant="h5" color="blue-gray">
                                Tổng Đơn Hàng
                            </Typography>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Typography color="gray">
                                        Tổng cộng ({cartData.totalItems} sản phẩm):
                                    </Typography>
                                    <Typography color="blue-gray">
                                        {formatCurrency(cartData.subTotal)}
                                    </Typography>
                                </div>

                                <div className="flex justify-between">
                                    <Typography color="gray">Shipping:</Typography>
                                    <Typography color="gray">0đ</Typography>
                                </div>

                                <hr className="my-3" />

                                <div className="flex justify-between">
                                    <Typography variant="h6" color="blue-gray">
                                        Tổng:
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        {formatCurrency(cartData.totalAmount)}
                                    </Typography>
                                </div>

                                {cartData.hasOutOfStockItems && (
                                    <div className="bg-red-50 p-3 rounded-lg mt-4">
                                        <Typography variant="small" color="red">
                                            ⚠️ Some items in your cart are out of stock
                                        </Typography>
                                    </div>
                                )}

                                <Button
                                    color="blue"
                                    size="lg"
                                    fullWidth
                                    className="mt-6"
                                    disabled={cartData.hasOutOfStockItems}
                                >
                                    Thực hiện thanh toán
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="lg"
                                    fullWidth
                                >
                                    tiếp tục mua sắm
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ViewCart;