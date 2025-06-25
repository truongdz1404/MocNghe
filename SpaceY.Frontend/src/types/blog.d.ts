// types/blog.dto.d.ts

export interface BlogDto {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    banner: string;
}

export interface CreateBlogDto {
    title: string;
    content: string;
    banner: string;
}

export interface UpdateBlogDto {
    title: string;
    content: string;
    banner: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}
  