'use client'
import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    CardBody,
    CardHeader,
    Typography,
    IconButton,
    Checkbox,
} from "@/components/ui/MaterialTailwind";
import cartServices, { CartSummary, CartItem } from '@/services/CartServices';
import CheckoutPopup from '@/components/cart/CheckoutPopup';
import Image from 'next/image';
import { Truck } from 'lucide-react';

const SHIP_COST = 30000;
const SHIP_COST_FREE = 300000;

const ViewCart: React.FC = () => {
    const [cartData, setCartData] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        // Update selectAll state based on selected items
        if (cartData && cartData.items.length > 0) {
            const allInStockItems = cartData.items.filter(item => item.inStock);
            const allSelected = allInStockItems.length > 0 &&
                allInStockItems.every(item => selectedItems.has(item.productVariantId));
            setSelectAll(allSelected);
        }
    }, [selectedItems, cartData]);

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

    // Optimized update quantity - update local state immediately
    const updateQuantity = async (productVariantId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingItems(prev => new Set(prev).add(productVariantId));

            // Update local state immediately for better UX
            setCartData(prevCart => {
                if (!prevCart) return prevCart;

                const updatedItems = prevCart.items.map(item => {
                    if (item.productVariantId === productVariantId) {
                        const updatedItem = {
                            ...item,
                            quantity: newQuantity,
                            subTotal: item.price * newQuantity
                        };
                        return updatedItem;
                    }
                    return item;
                });

                // Recalculate totals
                const newSubTotal = updatedItems.reduce((total, item) => total + item.subTotal, 0);
                const newShippingCost = newSubTotal > SHIP_COST_FREE ? 0 : SHIP_COST;
                const newTotalAmount = newSubTotal + newShippingCost;

                return {
                    ...prevCart,
                    items: updatedItems,
                    subTotal: newSubTotal,
                    totalAmount: newTotalAmount
                };
            });

            // Make API call in background
            const response = await cartServices.updateCartItem({
                productVariantId,
                quantity: newQuantity
            });

            if (!response.success) {
                // If API call fails, revert the optimistic update
                await fetchCart();
                setError(response.message);
            }
        } catch (err) {
            // If API call fails, revert the optimistic update
            await fetchCart();
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

    // Optimized remove item - update local state immediately
    const removeItem = async (productVariantId: number) => {
        try {
            setUpdatingItems(prev => new Set(prev).add(productVariantId));

            // Store the item being removed for potential rollback
            // const itemToRemove = cartData?.items.find(item => item.productVariantId === productVariantId);

            // Update local state immediately
            setCartData(prevCart => {
                if (!prevCart) return prevCart;

                const updatedItems = prevCart.items.filter(item => item.productVariantId !== productVariantId);

                // Recalculate totals
                const newSubTotal = updatedItems.reduce((total, item) => total + item.subTotal, 0);
                const newShippingCost = newSubTotal > SHIP_COST_FREE ? 0 : SHIP_COST;
                const newTotalAmount = newSubTotal + newShippingCost;
                const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);

                return {
                    ...prevCart,
                    items: updatedItems,
                    subTotal: newSubTotal,
                    totalAmount: newTotalAmount,
                    totalItems: newTotalItems,
                    hasOutOfStockItems: updatedItems.some(item => !item.inStock)
                };
            });

            // Remove from selected items as well
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productVariantId);
                return newSet;
            });

            // Make API call in background
            const response = await cartServices.removeFromCart(productVariantId);

            if (!response.success) {
                // If API call fails, revert the optimistic update
                await fetchCart();
                setError(response.message);
            }
        } catch (err) {
            // If API call fails, revert the optimistic update
            await fetchCart();
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

    const handleSelectAll = (checked: boolean) => {
        if (!cartData) return;

        setSelectAll(checked);
        if (checked) {
            // Select all in-stock items
            const inStockItemIds = cartData.items
                .filter(item => item.inStock)
                .map(item => item.productVariantId);
            setSelectedItems(new Set(inStockItemIds));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleSelectItem = (productVariantId: number, checked: boolean) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(productVariantId);
            } else {
                newSet.delete(productVariantId);
            }
            return newSet;
        });
    };

    const getSelectedItemsData = (): CartItem[] => {
        if (!cartData) return [];
        return cartData.items.filter(item => selectedItems.has(item.productVariantId));
    };

    const calculateSelectedTotals = () => {
        const selectedItemsData = getSelectedItemsData();
        const subTotal = selectedItemsData.reduce((total, item) => total + item.subTotal, 0);
        const shippingCost = subTotal > SHIP_COST_FREE ? 0 : SHIP_COST;
        const totalAmount = subTotal + shippingCost;

        return { subTotal, shippingCost, totalAmount };
    };

    const handleCheckout = () => {
        if (selectedItems.size === 0) {
            setError('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }
        setShowCheckoutPopup(true);
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

    const selectedTotals = calculateSelectedTotals();
    const selectedItemsData = getSelectedItemsData();

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Card className="mb-6">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h4" color="blue-gray" className='mb-4'>
                            Giỏ Hàng ({cartData.totalItems} sản phẩm)
                        </Typography>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Select All */}
                    <Card>
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={selectAll}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    crossOrigin={undefined}
                                />
                                <Typography variant="h6" color="blue-gray">
                                    Chọn tất cả ({cartData.items.filter(item => item.inStock).length} sản phẩm)
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>

                    {cartData.items.map((item: CartItem) => (
                        <Card key={item.productVariantId} className="overflow-hidden">
                            <CardBody className="p-4">
                                <div className="flex gap-4">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 flex items-start pt-2">
                                        <Checkbox
                                            checked={selectedItems.has(item.productVariantId)}
                                            onChange={(e) => handleSelectItem(item.productVariantId, e.target.checked)}
                                            disabled={!item.inStock}
                                            crossOrigin={undefined}
                                        />
                                    </div>

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
                                                    disabled={item.quantity <= 1 || updatingItems.has(item.productVariantId) || !item.inStock}
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
                                                    disabled={item.quantity >= item.availableStock || updatingItems.has(item.productVariantId) || !item.inStock}
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

                {/* Order Summary - Now shows selected items only */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader floated={false} shadow={false} className="rounded-none">
                            <Typography variant="h5" color="blue-gray">
                                Tổng Đơn Hàng
                            </Typography>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="space-y-3">
                                {selectedItems.size > 0 ? (
                                    <>
                                        <div className="flex justify-between">
                                            <Typography color="gray">
                                                Tạm tính ({selectedItems.size} sản phẩm):
                                            </Typography>
                                            <Typography color="blue-gray">
                                                {formatCurrency(selectedTotals.subTotal)}
                                            </Typography>
                                        </div>

                                        <div className="flex justify-between">
                                            <Typography color="gray">Phí vận chuyển:</Typography>
                                            <Typography color="gray">
                                                {selectedTotals.shippingCost === 0 ? 'Miễn phí' : formatCurrency(selectedTotals.shippingCost)}
                                            </Typography>
                                        </div>

                                        <hr className="my-3" />

                                        <div className="flex justify-between">
                                            <Typography variant="h6" color="blue-gray">
                                                Tổng thanh toán:
                                            </Typography>
                                            <Typography variant="h6" color="blue-gray">
                                                {formatCurrency(selectedTotals.totalAmount)}
                                            </Typography>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <Typography color="gray">
                                            Vui lòng chọn sản phẩm để xem tổng đơn hàng
                                        </Typography>
                                    </div>
                                )}

                                {cartData.hasOutOfStockItems && (
                                    <div className="bg-red-50 p-3 rounded-lg mt-4">
                                        <Typography variant="small" color="red">
                                            ⚠️ Một số sản phẩm trong giỏ hàng đã hết hàng
                                        </Typography>
                                    </div>
                                )}

                                <Button
                                    color="blue"
                                    size="lg"
                                    fullWidth
                                    className="mt-6"
                                    disabled={selectedItems.size === 0}
                                    onClick={handleCheckout}
                                >
                                    {selectedItems.size > 0
                                        ? `Thực hiện thanh toán (${selectedItems.size} sản phẩm)`
                                        : 'Chọn sản phẩm để thanh toán'
                                    }
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="blue-gray"
                                    size="lg"
                                    fullWidth
                                >
                                    Tiếp tục mua sắm
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className='items-center py-2'>
                        <Typography variant="h6" color="blue-gray" className='flex gap-2'>
                            <Truck className="w-5 h-5 text-green-600" />
                            <p>Free ship cho đơn hàng từ {formatCurrency(SHIP_COST_FREE)}</p>
                        </Typography>
                    </Card>
                </div>
            </div>

            {/* Checkout Popup */}
            <CheckoutPopup
                open={showCheckoutPopup}
                onClose={() => setShowCheckoutPopup(false)}
                selectedItems={selectedItemsData}
                totalAmount={selectedTotals.totalAmount}
                subTotal={selectedTotals.subTotal}
                shippingCost={selectedTotals.shippingCost}
            />
        </div>
    );
};

export default ViewCart;