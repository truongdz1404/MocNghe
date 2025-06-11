"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import CategoryServices from "@/services/CategoryServices";
import ProductServices from "@/services/ProductServices";
import CloudinaryImageUploader from "@/components/image/ImageUploader"; 
import {
    CreateProductDto,
    ColorDto,
    SizeDto
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

export default function CreateProductPage() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<CreateProductDto>({
        title: "",
        description: "",
        categoryIds: [],
        featured: false,
        visible: true,
        images: [],
        variants: []
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

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Handle category selection
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData(prev => ({
            ...prev,
            categoryIds: selectedOptions
        }));
    };

    // Handle variant input changes
    const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setCurrentVariant(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 :
                name.includes('Id') ? parseInt(value) || 0 : value
        }));
    };

    // Add variant
    const handleAddVariant = () => {
        if (!currentVariant.colorId || !currentVariant.sizeId) {
            alert("Vui lòng chọn màu sắc và kích thước");
            return;
        }

        const newVariant: ProductVariantDto = {
            id: Date.now(), // Temporary ID
            productId: 0, // Will be set by backend
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

        // Reset current variant
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

    // Remove variant
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

    // Get color name by ID
    const getColorName = (colorId: number) => {
        return mockColors.find(c => c.id === colorId)?.name || "Unknown";
    };

    // Get size name by ID
    const getSizeName = (sizeId: number) => {
        return mockSizes.find(s => s.id === sizeId)?.name || "Unknown";
    };

    // Handle form submission
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
            const result = await ProductServices.Create(formData);
            alert("Tạo sản phẩm thành công!");
            // Reset form or redirect
            console.log("Created product with ID:", result.id);
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Có lỗi xảy ra khi tạo sản phẩm");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Tạo Sản Phẩm Mới</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Thông Tin Cơ Bản</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên Sản Phẩm *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh Mục
                            </label>
                            <select
                                multiple
                                value={formData.categoryIds.map(String)}
                                onChange={handleCategoryChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Giữ Ctrl để chọn nhiều danh mục</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô Tả
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-6 mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Sản phẩm nổi bật
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="visible"
                                checked={formData.visible}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Hiển thị
                        </label>
                    </div>
                </div>

                {/* Images Section - Sử dụng CloudinaryImageUploader component */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Hình Ảnh Sản Phẩm</h2>
                    <CloudinaryImageUploader onImageUrlsChange={handleImageUrls} />
                </div>

                {/* Product Variants */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Biến Thể Sản Phẩm</h2>

                    {/* Add Variant Form */}
                    <div className="bg-white p-4 rounded-lg mb-4 border">
                        <h3 className="text-lg font-medium mb-3">Thêm Biến Thể</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                                <select
                                    name="colorId"
                                    value={currentVariant.colorId || ""}
                                    onChange={handleVariantChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn màu</option>
                                    {mockColors.map(color => (
                                        <option key={color.id} value={color.id}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kích thước</label>
                                <select
                                    name="sizeId"
                                    value={currentVariant.sizeId || ""}
                                    onChange={handleVariantChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn size</option>
                                    {mockSizes.map(size => (
                                        <option key={size.id} value={size.id}>
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={currentVariant.price || ""}
                                    onChange={handleVariantChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={currentVariant.originalPrice || ""}
                                    onChange={handleVariantChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={currentVariant.stock || ""}
                                    onChange={handleVariantChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={currentVariant.sku || ""}
                                    onChange={handleVariantChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddVariant}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm Biến Thể
                        </button>
                    </div>

                    {/* Variants List */}
                    {formData.variants.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium">Danh Sách Biến Thể ({formData.variants.length})</h3>
                            {formData.variants.map((variant, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border flex items-center justify-between">
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Màu:</span> {getColorName(variant.colorId)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Size:</span> {getSizeName(variant.sizeId)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Giá:</span> {variant.price.toLocaleString()}đ
                                        </div>
                                        <div>
                                            <span className="font-medium">Giá gốc:</span> {variant.originalPrice.toLocaleString()}đ
                                        </div>
                                        <div>
                                            <span className="font-medium">Số lượng:</span> {variant.stock}
                                        </div>
                                        <div>
                                            <span className="font-medium">SKU:</span> {variant.sku || "N/A"}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(index)}
                                        className="ml-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                    >
                        {loading ? "Đang tạo..." : "Tạo Sản Phẩm"}
                    </button>
                </div>
            </form>
        </div>
    );
}