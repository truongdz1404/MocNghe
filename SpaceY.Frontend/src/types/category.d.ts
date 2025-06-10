// category.d.ts
export interface CategoryDto {
    id: number;
    name: string;
    url: string;
    visible: boolean;
    deleted: boolean;
    createdAt: string;
    modifiedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    url: string;
    visible: boolean;
}

export interface UpdateCategoryDto {
    name: string;
    url: string;
    visible: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    totalCount: number;
}

export interface CategorySearchParams {
    pageNumber?: number;
    pageSize?: number;
    includeDeleted?: boolean;
}

export interface ApiResponse<T = unknown> {
    data?: T;
    message?: string;
    error?: string;
}

export interface CreateCategoryResponse {
    id: number;
    message: string;
}

export interface CountResponse {
    count: number;
  }