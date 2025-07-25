import api from "@/services/api";
import {
    ProductDto,
    CreateProductDto,
    UpdateProductDto,
    PaginatedData,
    GetByMultipleCategoriesRequest,
    CategoryIdsRequest,
    ProductSearchParams,
    ApiResponse,
    CreateProductResponse,
    CountResponse
} from "@/types/product";

// Get all products
const GetAll = async (includeDeleted: boolean = false): Promise<ProductDto[]> => {
    const response = await api.get(`/products?includeDeleted=${includeDeleted}`);
    return response.data;
};

// Get visible products
const GetVisible = async (): Promise<ProductDto[]> => {
    const response = await api.get('/products/visible');
    return response.data;
};

// Get featured products
const GetFeatured = async (): Promise<ProductDto[]> => {
    const response = await api.get('/products/featured');
    return response.data;
};

// Get products by category
const GetByCategory = async (categoryId: number): Promise<ProductDto[]> => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
};

// Get products by multiple categories
const GetByMultipleCategories = async (request: GetByMultipleCategoriesRequest): Promise<ProductDto[]> => {
    const response = await api.post('/products/categories', request);
    return response.data;
};

// Get paginated products
const GetPaginated = async (params: ProductSearchParams = {}): Promise<PaginatedData<ProductDto>> => {
    const {
        pageNumber = 1,
        pageSize = 10,
        includeDeleted = false,
        searchTerm,
        categoryId,
    } = params;

    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        searchTerm: searchTerm ? encodeURIComponent(searchTerm) : '',
        includeDeleted: includeDeleted.toString()
    });

    if (categoryId !== undefined && categoryId !== null) {
        queryParams.append('categoryId', categoryId.toString());
    }

    const response = await api.get(`/products/paginated?${queryParams}`);
    return response.data;
};


// Search products
const Search = async (searchTerm: string): Promise<ProductDto[]> => {
    const response = await api.get(`/products/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data;
};

// Get product by ID
const GetById = async (id: number, includeDetails: boolean = false): Promise<ProductDto> => {
    const response = await api.get(`/products/${id}?includeDetails=${includeDetails}`);
    return response.data;
};

// Get products count
const GetCount = async (): Promise<number> => {
    const response = await api.get<CountResponse>('/products/count');
    return response.data.count;
};

// Create product
const Create = async (product: CreateProductDto): Promise<CreateProductResponse> => {
    const response = await api.post<CreateProductResponse>('/products', product);
    return response.data;
};

// Update product
const Update = async (id: number, product: UpdateProductDto): Promise<ApiResponse> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
};

// Delete product (hard delete)
const Delete = async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

// Soft delete product
const SoftDelete = async (id: number): Promise<ApiResponse> => {
    const response = await api.patch(`/products/${id}/soft-delete`);
    return response.data;
};

// Add categories to product
const AddCategoriesToProduct = async (id: number, categoryIds: number[]): Promise<ApiResponse> => {
    const request: CategoryIdsRequest = { categoryIds };
    const response = await api.post(`/products/${id}/categories`, request);
    return response.data;
};

// Remove categories from product
const RemoveCategoriesFromProduct = async (id: number, categoryIds: number[]): Promise<ApiResponse> => {
    const request: CategoryIdsRequest = { categoryIds };
    const response = await api.delete(`/products/${id}/categories`, { data: request });
    return response.data;
};

const ProductServices = {
    GetAll,
    GetVisible,
    GetFeatured,
    GetByCategory,
    GetByMultipleCategories,
    GetPaginated,
    Search,
    GetById,
    GetCount,
    Create,
    Update,
    Delete,
    SoftDelete,
    AddCategoriesToProduct,
    RemoveCategoriesFromProduct,
};

export default ProductServices;