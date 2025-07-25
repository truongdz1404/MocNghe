"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Input,
    // Textarea,
    Checkbox,
    Button,
    IconButton,
} from "@/components/ui/MaterialTailwind";
import { ChevronDown, Plus, X } from "lucide-react";
import CategoryServices from "@/services/CategoryServices";
import ProductServices from "@/services/ProductServices";
import CloudinaryImageUploader from "@/components/image/ImageUploader";
import {
    UpdateProductDto,
    ColorDto,
    SizeDto,
    ProductDto,
} from "@/types/product";
import { CategoryDto } from "@/types/category";
import { ProductVariantDto } from "@/types/productVariant";

const mockColors: ColorDto[] = [
    { id: 1, name: "Đỏ", hexCode: "#FF0000" },
    { id: 2, name: "Xanh dương", hexCode: "#0000FF" },
    { id: 3, name: "Đen", hexCode: "#000000" },
    { id: 4, name: "Trắng", hexCode: "#FFFFFF" },
];

const mockSizes: SizeDto[] = [
    { id: 1, name: "S", description: "Small" },
    { id: 2, name: "M", description: "Medium" },
    { id: 3, name: "L", description: "Large" },
    { id: 4, name: "XL", description: "Extra Large" },
];

interface EditProductPopupProps {
    product: ProductDto;
    onClose: () => void;
    onUpdated?: () => void;
}

export default function EditProductPopup({ product, onClose, onUpdated }: EditProductPopupProps) {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<UpdateProductDto>({
        title: product.title,
        description: product.description,
        imageUrl: product.image2DUrl || product.images?.[0]?.url || "",
        categoryIds: product.categories.map(c => c.id),
        featured: product.featured,
        visible: product.visible,
        images: product.images || [],
        variants: product.variants || [],
    });

    const [currentVariant, setCurrentVariant] = useState<Partial<ProductVariantDto>>({
        colorId: 0,
        sizeId: 0,
        price: 0,
        originalPrice: 0,
        stock: 0,
        sku: "",
        visible: true
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await CategoryServices.GetAll();
                setCategories(categoriesData.filter(cat => cat.visible && !cat.deleted));
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleCategoryToggle = (categoryId: number) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setCurrentVariant(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 :
                name.includes('Id') ? parseInt(value) || 0 : value
        }));
    };

    const handleAddVariant = () => {
        if (!currentVariant.colorId || !currentVariant.sizeId) {
            alert("Vui lòng chọn màu sắc và kích thước");
            return;
        }
        const newVariant: ProductVariantDto = {
            id: Date.now(),
            productId: product.id,
            colorId: currentVariant.colorId!,
            sizeId: currentVariant.sizeId!,
            price: currentVariant.price || 0,
            originalPrice: currentVariant.originalPrice || 0,
            stock: currentVariant.stock || 0,
            sku: currentVariant.sku || "",
            visible: currentVariant.visible ?? true
        };
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, newVariant]
        }));
        setCurrentVariant({
            colorId: 0,
            sizeId: 0,
            price: 0,
            originalPrice: 0,
            stock: 0,
            sku: "",
            visible: true
        });
    };

    const handleRemoveVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleImageUrls = useCallback((urls: string[]) => {
        setFormData(prev => ({
            ...prev,
            images: urls.map((url, index) => ({
                id: index,
                url,
                alt: '',
            })),
        }));
    }, []);

    const getColorName = (colorId: number) => {
        return mockColors.find(c => c.id === colorId)?.name || "Unknown";
    };

    const getSizeName = (sizeId: number) => {
        return mockSizes.find(s => s.id === sizeId)?.name || "Unknown";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (formData.variants.length === 0) {
            alert("Vui lòng thêm ít nhất một biến thể sản phẩm");
            return;
        }
        setLoading(true);
        try {
            await ProductServices.Update(product.id, formData);
            alert("Cập nhật sản phẩm thành công!");
            if (onUpdated) onUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Có lỗi xảy ra khi cập nhật sản phẩm");
        }
        setLoading(false);
    };

    return (
        <Card className="max-w-6xl mx-auto h-[calc(100vh-32px)] overflow-y-auto">
            <CardHeader>
                <Typography variant="h3" color="blue-gray">
                    Chỉnh Sửa Sản Phẩm
                </Typography>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="shadow-none border">
                        <CardBody className="space-y-4">
                            <Typography variant="h5" color="blue-gray">
                                Thông Tin Cơ Bản
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Tên Sản Phẩm *"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    crossOrigin={undefined}
                                />
                                <div>
                                    <div className="relative" ref={dropdownRef}>
                                        <div
                                            className="w-full min-h-[44px] px-3 py-2.5 border border-blue-gray-200 rounded-lg bg-transparent cursor-pointer flex items-center justify-between"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        >
                                            <div className="flex-1">
                                                {formData.categoryIds.length === 0 ? (
                                                    <span className="text-blue-gray-500">Chọn danh mục</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1">
                                                        {formData.categoryIds.slice(0, 3).map(categoryId => {
                                                            const category = categories.find(cat => cat.id === categoryId);
                                                            return category ? (
                                                                <span
                                                                    key={categoryId}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-md"
                                                                >
                                                                    {category.name}
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleCategoryToggle(categoryId);
                                                                        }}
                                                                        className="hover:bg-blue-200 rounded-full p-0.5"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </span>
                                                            ) : null;
                                                        })}
                                                        {formData.categoryIds.length > 3 && (
                                                            <span className="text-xs text-blue-gray-500">
                                                                +{formData.categoryIds.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        <label className="absolute left-3 -top-2.5 px-1 text-xs text-blue-gray-500 bg-white">
                                            Danh Mục
                                        </label>
                                        {isDropdownOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-blue-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {categories.map(category => (
                                                    <label
                                                        key={category.id}
                                                        className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.categoryIds.includes(category.id)}
                                                            onChange={() => handleCategoryToggle(category.id)}
                                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm">{category.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Typography variant="small" color="gray" className="mt-1">
                                        Click để mở danh sách và chọn nhiều danh mục
                                    </Typography>
                                </div>
                            </div>
                            <textarea
                                // label="Mô Tả"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                            />
                            <div className="flex gap-6">
                                <Checkbox
                                    label="Sản phẩm nổi bật"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleInputChange}
                                    crossOrigin={undefined}
                                />
                                <Checkbox
                                    label="Hiển thị"
                                    name="visible"
                                    checked={formData.visible}
                                    onChange={handleInputChange}
                                    crossOrigin={undefined}
                                />
                            </div>
                        </CardBody>
                    </Card>
                    {/* Images Section */}
                    <Card className="shadow-none border">
                        <CardBody>
                            <Typography variant="h5" color="blue-gray" className="mb-4">
                                Hình Ảnh Sản Phẩm
                            </Typography>
                            <CloudinaryImageUploader onImageUrlsChange={handleImageUrls} />
                        </CardBody>
                    </Card>
                    {/* Product Variants */}
                    <Card className="shadow-none border">
                        <CardBody className="space-y-4">
                            <Typography variant="h5" color="blue-gray">
                                Biến Thể Sản Phẩm
                            </Typography>
                            <Card className="shadow-sm">
                                <CardBody>
                                    <Typography variant="h6" color="blue-gray" className="mb-6">
                                        Thêm Biến Thể
                                    </Typography>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                        <div className="w-full">
                                            <div className="relative">
                                                <select
                                                    name="colorId"
                                                    value={currentVariant.colorId || ""}
                                                    onChange={handleVariantChange}
                                                    className="w-full h-11 px-3 py-2.5 text-sm border border-blue-gray-200 rounded-lg bg-transparent focus:border-gray-900 focus:outline-none peer"
                                                >
                                                    <option value="">Chọn màu</option>
                                                    {mockColors.map((color) => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label className="absolute left-3 -top-2.5 px-1 text-xs text-blue-gray-500 bg-white peer-focus:text-gray-900 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-900 transition-all">
                                                    Màu sắc
                                                </label>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="relative">
                                                <select
                                                    name="sizeId"
                                                    value={currentVariant.sizeId || ""}
                                                    onChange={handleVariantChange}
                                                    className="w-full h-11 px-3 py-2.5 text-sm border border-blue-gray-200 rounded-lg bg-transparent focus:border-gray-900 focus:outline-none peer"
                                                >
                                                    <option value="">Chọn size</option>
                                                    {mockSizes.map((size) => (
                                                        <option key={size.id} value={size.id}>
                                                            {size.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label className="absolute left-3 -top-2.5 px-1 text-xs text-blue-gray-500 bg-white peer-focus:text-gray-900 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-900 transition-all">
                                                    Kích thước
                                                </label>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                label="Giá bán"
                                                type="number"
                                                name="price"
                                                value={currentVariant.price || ""}
                                                onChange={handleVariantChange}
                                                min="0"
                                                step="0.01"
                                                crossOrigin={undefined}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                        <div className="w-full">
                                            <Input
                                                label="Giá gốc"
                                                type="number"
                                                name="originalPrice"
                                                value={currentVariant.originalPrice || ""}
                                                onChange={handleVariantChange}
                                                min="0"
                                                step="0.01"
                                                crossOrigin={undefined}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                label="Số lượng"
                                                type="number"
                                                name="stock"
                                                value={currentVariant.stock || ""}
                                                onChange={handleVariantChange}
                                                min="0"
                                                crossOrigin={undefined}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <Input
                                                label="SKU"
                                                type="text"
                                                name="sku"
                                                value={currentVariant.sku || ""}
                                                onChange={handleVariantChange}
                                                crossOrigin={undefined}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleAddVariant}
                                        className="mt-2 flex items-center gap-2"
                                        color="blue"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Thêm Biến Thể
                                    </Button>
                                </CardBody>
                            </Card>
                            {formData.variants.length > 0 && (
                                <div className="space-y-2">
                                    <Typography variant="h6" color="blue-gray">
                                        Danh Sách Biến Thể ({formData.variants.length})
                                    </Typography>
                                    {formData.variants.map((variant, index) => (
                                        <Card key={index} className="shadow-sm">
                                            <CardBody className="flex items-center justify-between">
                                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                                                    <Typography variant="small" color="blue-gray">
                                                        <span className="font-medium">Màu:</span> {getColorName(variant.colorId)}
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray">
                                                        <span className="font-medium">Size:</span> {getSizeName(variant.sizeId)}
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray">
                                                        <span className="font-medium">Giá:</span> {variant.price.toLocaleString()}đ
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray">
                                                        <span className="font-medium">Giá gốc:</span> {variant.originalPrice.toLocaleString()}đ
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray">
                                                        <span className="font-medium">Số lượng:</span> {variant.stock}
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray">
                                                        <span className="font-medium">SKU:</span> {variant.sku || "N/A"}
                                                    </Typography>
                                                </div>
                                                <IconButton
                                                    color="red"
                                                    onClick={() => handleRemoveVariant(index)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </IconButton>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </form>
                <div className="flex justify-end my-5">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        color="blue"
                        size="lg"
                    >
                        {loading ? "Đang cập nhật..." : "Chỉnh Sửa Sản Phẩm"}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}