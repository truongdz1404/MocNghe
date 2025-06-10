import { CategoryDto } from "@/types/category";

// product.d.ts
export interface ImageDto {
    id: number;
    url: string;
    alt: string;
}

export interface ColorDto {
    id: number;
    name: string;
    hexCode: string;
}

export interface SizeDto {
    id: number;
    name: string;
    description: string;
}


export interface ProductDto {
    id: number;
    title: string;
    description: string;
    categories: CategoryDto[];
    featured: boolean;
    visible: boolean;
    deleted: boolean;
    createdAt: string;
    modifiedAt: string;
    images: ImageDto[];
    variants: ProductVariantDto[];
    reviewCount: number;
    averageRating: number;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
    totalStock: number;
    availableColors: ColorDto[];
    availableSizes: SizeDto[];
    priceRange: string;
}

export interface CreateProductDto {
    title: string;
    description: string;
    categoryIds: number[];
    featured: boolean;
    visible: boolean;
    images: ImageDto[];
    variants: ProductVariantDto[];
}

export interface UpdateProductDto {
    title: string;
    description: string;
    imageUrl: string;
    categoryIds: number[];
    featured: boolean;
    visible: boolean;
    images: ImageDto[];
    variants: ProductVariantDto[];
}

export interface PaginatedData<T> {
    data: T[];
    totalCount: number;
}

export interface GetByMultipleCategoriesRequest {
    categoryIds: number[];
    useAndLogic: boolean;
}

export interface CategoryIdsRequest {
    categoryIds: number[];
}

export interface ProductSearchParams {
    pageNumber?: number;
    pageSize?: number;
    includeDeleted?: boolean;
    searchTerm?: string;
    includeDetails?: boolean;
    categoryId?: number;
}

export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    error?: string;
}

export interface CreateProductResponse {
    id: number;
    message: string;
}

export interface CountResponse {
    count: number;
  }