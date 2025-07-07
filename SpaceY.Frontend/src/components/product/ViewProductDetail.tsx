'use client'
import ProductList, { AddToCartParams } from "@/components/product/ProductList";
import cartServices, { AddToCartRequest } from "@/services/CartServices";
import ProductServices from "@/services/ProductServices";
import { ProductDto } from "@/types/product";
import { AxiosError } from "axios";
import { Plus, Minus, Star, Shield, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    id: string; // Thay params thành id, giữ kiểu string
}

const PAGE_SIZE = 4;
const PAGE_NUMBER = 1;

export default function ViewProductDetail({ id }: Props) {
    const [product, setProduct] = useState<ProductDto>()
    const [productRecently, setProductRecently] = useState<ProductDto[]>([]);
    const [anotherProducts, setAnotherProducts] = useState<ProductDto[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductServices.GetById(parseInt(id), true);
                setProduct(response);
                const productRecently = ProductServices.GetPaginated({ pageNumber: PAGE_NUMBER, pageSize: PAGE_SIZE, categoryId: response?.categories[0]?.id, includeDeleted: false });
                const anotherProducts = ProductServices.GetPaginated({ pageNumber: PAGE_NUMBER, pageSize: PAGE_SIZE, includeDeleted: false });
                setProductRecently((await productRecently).data);
                setAnotherProducts((await anotherProducts).data);
                // Set default selections
                if (response?.availableColors?.length > 0) {
                    setSelectedColorId(response.availableColors[0].id);
                }
                if (response?.availableSizes?.length > 0) {
                    setSelectedSizeId(response.availableSizes[0].id);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

     const handleAddToCart = async ({
            productVariantId,
            quantity,
            onSuccess,
            onError,
            showNotification = true
        }: AddToCartParams): Promise<boolean> => {
            try {
                // Validate input
                if (!productVariantId || productVariantId <= 0) {
                    const errorMsg = 'Invalid product variant ID';
                    if (showNotification) {
                        toast.error(errorMsg);
                    }
                    onError?.(errorMsg);
                    return false;
                }
    
                if (!quantity || quantity <= 0) {
                    const errorMsg = 'Quantity must be at least 1';
                    if (showNotification) {
                        toast.error(errorMsg);
                    }
                    onError?.(errorMsg);
                    return false;
                }
    
                // Prepare request data
                const requestData: AddToCartRequest = {
                    productVariantId,
                    quantity
                };
    
                // Call cart service
                const response = await cartServices.addToCart(requestData);
    
                if (response.success) {
                    // Success handling
                    if (showNotification) {
                        toast.success(response.message || 'Thêm vào giỏ hàng thành công!');
                    }
                    onSuccess?.();
                    return true;
                } else {
                    // Handle API errors
                    const errorMsg = response.message || 'Không thể thêm sản phẩm vào giỏ hàng';
                    if (showNotification) {
                        toast.error(errorMsg);
                    }
                    onError?.(errorMsg);
                    return false;
                }
            } catch (error: unknown) {
                        let errorMsg = 'Không thể thêm sản phẩm vào giỏ hàng';
            
                        if (error instanceof AxiosError) {
                            errorMsg = error.response?.data?.message || error.message || errorMsg;
                        } else if (error instanceof Error) {
                            errorMsg = error.message;
                        }
            
                        console.error('Error adding to cart:', error);
            
                        if (showNotification) {
                            toast.error(errorMsg);
                        }
                        onError?.(errorMsg);
                        return false;
                    }
        };
    const isAddingToCart = addingToCart.has(Number.parseInt(id));
        const onAddToCartClick = async (product: ProductDto) => {
            // Get the first variant (assuming it's the default one)
            const defaultVariant = product.variants[0];
    
            if (!defaultVariant) {
                toast.error('Sản phẩm không có phiên bản khả dụng');
                return;
            }
    
            // Add product ID to loading set
            setAddingToCart(prev => new Set(prev).add(product.id));
    
            try {
                const success = await handleAddToCart({
                    productVariantId: defaultVariant.id,
                    quantity: 1,
                    onSuccess: () => {
                        console.log('Successfully added to cart:', product.title);
                    },
                    onError: (error) => {
                        console.error('Failed to add to cart:', error);
                    }
                });
    
                if (success) {
                    // Additional success handling if needed
                    console.log('Product added to cart successfully');
                }
            } finally {
                // Remove product ID from loading set
                setAddingToCart(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(product.id);
                    return newSet;
                });
            }
        };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <header className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-6">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <User className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                                <ShoppingCart className="w-5 h-5 text-gray-600" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header> */}

            {/* Main Content */}
            <main className="container mx-auto px-4 lg:px-6 py-8">
                {/* Product Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Product Images */}
                        <div className="p-6 lg:p-8">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                                <Image
                                    alt={product?.images?.[selectedImageIndex]?.alt || product?.title || "Product image"}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    height="600"
                                    src={product?.images?.[selectedImageIndex]?.url || "/assets/placeholder.png"}
                                    width="600"
                                />
                            </div>
                            <div className="flex space-x-3 overflow-x-auto">
                                {product?.images?.map((image, index) => (
                                    <div
                                        key={image.id}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors flex-shrink-0 ${selectedImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                            height="100"
                                            src={image.url}
                                            width="100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {product?.title || "Loading..."}
                                </h1>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product?.categories?.map((category) => (
                                        <span key={category.id} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center space-x-1 mr-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product?.averageRating || 0)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product?.averageRating?.toFixed(1) || '0.0'} ({product?.reviewCount || 0} đánh giá)
                                    </span>
                                </div>
                                <div className="mb-4">
                                    {product?.minPrice === product?.maxPrice ? (
                                        <div className="text-3xl font-bold text-blue-600">
                                            {product?.minPrice?.toLocaleString('vi-VN')} VND
                                        </div>
                                    ) : (
                                        <div className="text-3xl font-bold text-blue-600">
                                            {product?.minPrice?.toLocaleString('vi-VN')} - {product?.maxPrice?.toLocaleString('vi-VN')} VND
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${product?.inStock
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product?.inStock ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                        {product?.totalStock && (
                                            <span className="text-sm text-gray-500">
                                                ({product.totalStock} sản phẩm có sẵn)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Color Selection */}
                            {product?.availableColors && product.availableColors.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Màu sắc</label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.availableColors.map((color) => (
                                            <button
                                                key={color.id}
                                                onClick={() => setSelectedColorId(color.id)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${selectedColorId === color.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color.hexCode }}
                                                ></div>
                                                <span className="text-sm font-medium">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product?.availableSizes && product.availableSizes.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Kích thước</label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.availableSizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSizeId(size.id)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${selectedSizeId === size.id
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                title={size.description}
                                            >
                                                <span className="text-sm font-medium">{size.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Số lượng</label>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-colors shadow-md hover:shadow-lg ${product?.inStock
                                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    disabled={!product?.inStock}
                                >
                                    {product?.inStock ? 'Mua ngay' : 'Hết hàng'}
                                </button>
                                <button
                                    className={`w-full py-3 px-6 rounded-lg font-medium text-center transition-colors ${product?.inStock
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    disabled={!product?.inStock || isAddingToCart}
                                    onClick={() => product?.inStock && onAddToCartClick(product)}
                                >
                                    {isAddingToCart
                                        ? 'Đang thêm...'
                                        : (product?.inStock ? 'Thêm vào giỏ' : 'Hết hàng')
                                    }
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-3 border-t border-gray-200 pt-6">
                                <div className="flex items-center space-x-3 text-sm">
                                    <Truck className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">Miễn phí vận chuyển cho đơn hàng trên 300.000 VND</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <span className="text-gray-700">Bảo hành 12 tháng</span>
                                </div>
                                <div className="flex items-center space-x-3 text-sm">
                                    <RotateCcw className="w-5 h-5 text-orange-600" />
                                    <span className="text-gray-700">Đổi trả trong 7 ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả sản phẩm</h2>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {product?.description || "Đang tải thông tin sản phẩm..."}
                    </div>

                    {/* Product Variants */}
                    {product?.variants && product.variants.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Các phiên bản sản phẩm</h3>
                            <div className="space-y-3">
                                {product.variants.map((variant, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                                        <div>
                                            <span className="font-medium text-gray-900">Phiên bản {index + 1}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-blue-600">
                                                {/* Assuming variant has price property */}
                                                Chi tiết
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm cùng bộ sưu tập</h2>
                        <Link className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors" href="/product">
                            <span>Xem tất cả</span>
                            <Plus className="w-4 h-4" />
                        </Link>
                    </div>
                    <ProductList products={productRecently} />
                </div>

                {/* Suggested Products */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Gợi ý sản phẩm khác</h2>
                    <ProductList products={anotherProducts} />
                </div>
            </main>
        </div>
    );
}