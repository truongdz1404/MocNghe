import api from "@/services/api";
import {
    CategoryDto,
    CreateCategoryDto,
    UpdateCategoryDto,
    PaginatedData,
    CategorySearchParams,
    ApiResponse,
    CreateCategoryResponse,
    CountResponse
} from "@/types/category";

const GetAll = async (includeDeleted: boolean = false): Promise<CategoryDto[]> => {
    const response = await api.get(`/categories?includeDeleted=${includeDeleted}`);
    return response.data;
};
const GetCategoryRoom = async (): Promise<CategoryDto[]> => {
    const response = await api.get(`/categories/category-room`);
    return response.data;
};

// Get paginated categories
const GetPaginated = async (params: CategorySearchParams = {}): Promise<PaginatedData<CategoryDto>> => {
    const { pageNumber = 1, pageSize = 10, includeDeleted = false } = params;
    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        includeDeleted: includeDeleted.toString()
    });

    const response = await api.get(`/categories/paginated?${queryParams}`);
    return response.data;
};

// Get category by ID
const GetById = async (id: number): Promise<CategoryDto> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

// Get categories count
const GetCount = async (): Promise<number> => {
    const response = await api.get<CountResponse>('/categories/count');
    return response.data.count;
};

// Create category
const Create = async (category: CreateCategoryDto): Promise<CreateCategoryResponse> => {
    const response = await api.post<CreateCategoryResponse>('/categories', category);
    return response.data;
};

// Update category
const Update = async (id: number, category: UpdateCategoryDto): Promise<ApiResponse> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
};

// Delete category (hard delete)
const Delete = async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

// Soft delete category
const SoftDelete = async (id: number): Promise<ApiResponse> => {
    const response = await api.patch(`/categories/${id}/soft-delete`);
    return response.data;
};

const CategoryServices = {
    GetAll,
    GetPaginated,
    GetById,
    GetCount,
    Create,
    Update,
    Delete,
    SoftDelete,
    GetCategoryRoom,
};

export default CategoryServices;