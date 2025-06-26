'use client';
import React, { useRef, useState } from 'react';
import { Upload, ImageIcon, Info, MessageCircle, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductDto } from '@/types/product';
import { DroppedItem } from '@/types/work-space';
import AIChat from '@/components/work-space/ChatAI/AIChat';
import CartServices from '@/services/CartServices';
import {
    Tabs,
    TabsHeader,
    Tab,
} from '@/components/ui/MaterialTailwind';

interface SidebarPanelProps {
    onImageUpload: (file: File) => void;
    products: ProductDto[];
    onDragStart: (e: React.DragEvent, item: ProductDto) => void;
    droppedItems?: DroppedItem[];
    onRemoveItem?: (itemId: string) => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
    onImageUpload,
    products,
    onDragStart,
    droppedItems = [],
    onRemoveItem,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState("upload");
    const [productTab, setProductTab] = useState("products");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    // Group dropped items by product ID to count quantities
    const getSelectedProducts = () => {
        const productGroups: { [key: string]: { product: ProductDto; items: DroppedItem[]; quantity: number } } = {};

        droppedItems.forEach(item => {
            const productId = item.id.split('-')[0]; // Extract original product ID
            const product = products.find(p => p.id === Number(productId));

            if (product) {
                if (!productGroups[productId]) {
                    productGroups[productId] = {
                        product,
                        items: [],
                        quantity: 0
                    };
                }
                productGroups[productId].items.push(item);
                productGroups[productId].quantity++;
            }
        });

        return Object.values(productGroups);
    };

    const selectedProducts = getSelectedProducts();

    // Calculate total price
    const totalPrice = selectedProducts.reduce((total, group) => {
        const price = parseFloat(group.product.priceRange.replace(/[^\d.]/g, '')) || 0;
        return total + (price * group.quantity);
    }, 0);

    const handleRemoveProduct = (productId: string) => {
        if (onRemoveItem) {
            // Remove all instances of this product from canvas
            droppedItems.forEach(item => {
                if (item.id.startsWith(productId + '-')) {
                    onRemoveItem(item.id);
                }
            });
        }
    };

    const handleAddToCart = async () => {
        try {
            for (const group of selectedProducts) {
                // Assume the product has a variants array and use the first variant's ID
                // If ProductDto doesn't have variants, replace with the correct productVariantId source
                const productVariantId = group.product.variants?.[0]?.id || 1; // Fallback to 1 if no variants
                const cartItem = {
                    productId: group.product.id,
                    productVariantId: productVariantId,
                    quantity: group.quantity,
                };
                await CartServices.addToCart(cartItem);
            }
            router.push('/cart');
        } catch (error) {
            console.error('Error adding items to cart:', error);
            router.push('/login');
            // alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    return (
        <div className="lg:col-span-1 space-y-6">
            {/* Top Tabs - Upload, Guide, AI Chat */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
                <Tabs value={activeTab}>
                    <TabsHeader>
                        <Tab value="upload" onClick={() => setActiveTab("upload")}>
                            <div className="flex items-center gap-1 font-bold">
                                <Upload className="w-4 h-4" />
                                Tải ảnh
                            </div>
                        </Tab>
                        <Tab value="guide" onClick={() => setActiveTab("guide")}>
                            <div className="flex items-center gap-1">
                                <Info className="w-4 h-4" />
                                <p className="font-bold">Hướng dẫn</p>
                            </div>
                        </Tab>
                        <Tab value="ai-chat" onClick={() => setActiveTab("ai-chat")}>
                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <p className="font-bold">Trợ lý AI</p>
                            </div>
                        </Tab>
                    </TabsHeader>
                </Tabs>

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === "upload" && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-gradient-to-r from-orange-500 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                                <ImageIcon className="w-4 h-4" />
                                Chọn ảnh
                            </button>
                        </>
                    )}

                    {activeTab === "guide" && (
                        <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>Di chuyển:</strong> Kéo sản phẩm vào ô Canvas</li>
                                <li><strong>Chọn:</strong> Click vào hình ảnh để hiện bảng thuộc tính</li>
                                <li><strong>Xoay:</strong> Kéo handle tím phía trên</li>
                                <li><strong>Resize:</strong> Kéo handle xanh lá phía dưới</li>
                                <li><strong>Điều chỉnh:</strong> Dùng slider trong bảng thuộc tính</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === "ai-chat" && (
                        <AIChat />
                    )}
                </div>
            </div>

            {/* Bottom Section - Products and Selected Products */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 h-[480px] overflow-hidden flex flex-col">
                {/* Product Tabs */}
                <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setProductTab("products")}
                        className={`font-bold flex-1 py-2 px-4 rounded-md text-sm transition-all ${productTab === "products"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Sản Phẩm
                    </button>
                    <button
                        onClick={() => setProductTab("selected")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all relative ${productTab === "selected"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <ShoppingCart className="w-4 h-4 inline mr-1" />
                        Đã chọn
                        {selectedProducts.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {selectedProducts.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {productTab === "products" && (
                        <>
                            <h4 className="text-gray-700 mb-4"><strong>Mẹo:</strong> kéo sản phẩm vào ô Canvas</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {products.map((item) => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, item)}
                                        className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 rounded-xl p-4 cursor-move transition-all duration-300 flex items-center gap-3 transform hover:scale-105 hover:shadow-md"
                                    >
                                        <Image
                                            width={80}
                                            height={80}
                                            src={item.images[0].url}
                                            alt={item.title}
                                            className="w-20 h-20 object-contain"
                                        />
                                        <div>
                                            <h4 className="font-medium text-gray-700 text-sm">{item.title}</h4>
                                            <p className="text-xs text-gray-500">{item.priceRange}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {productTab === "selected" && (
                        <div className="space-y-4">
                            {selectedProducts.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Chưa có sản phẩm nào được chọn</p>
                                    <p className="text-sm">Kéo sản phẩm vào canvas để bắt đầu</p>
                                </div>
                            ) : (
                                <>
                                    {selectedProducts.map((group) => (
                                        <div
                                            key={group.product.id}
                                            className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-3"
                                        >
                                            <Image
                                                width={60}
                                                height={60}
                                                src={group.product.images[0].url}
                                                alt={group.product.title}
                                                className="w-15 h-15 object-contain"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-700 text-sm">{group.product.title}</h4>
                                                <p className="text-xs text-gray-500">{group.product.priceRange}</p>
                                                <p className="text-xs text-orange-600 font-medium">Số lượng: {group.quantity}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveProduct(group.product.id.toString())}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa khỏi canvas"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Total Price and Add to Cart */}
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-medium text-gray-700">Tổng tiền:</span>
                                            <span className="font-bold text-orange-600 text-lg">
                                                {totalPrice.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4">
                                            {selectedProducts.reduce((total, group) => total + group.quantity, 0)} sản phẩm
                                        </p>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={selectedProducts.length === 0}
                                            className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg ${selectedProducts.length === 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                                                }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Đi tới giỏ hàng
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarPanel;