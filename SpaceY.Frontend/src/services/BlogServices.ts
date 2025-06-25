import api from "@/services/api";

import {
    BlogDto,
    CreateBlogDto,
    UpdateBlogDto,
    ApiResponse,
} from '@/types/blog';

const blogServices = {
    // ✅ Lấy danh sách bài viết
    getAll: async (): Promise<BlogDto[]> => {
        const response = await api.get('/blog');
        return response.data;
    },

    // ✅ Lấy chi tiết 1 bài viết
    getById: async (id: number): Promise<BlogDto> => {
        const response = await api.get(`/blog/${id}`);
        return response.data;
    },

    // ✅ Tạo bài viết mới
    create: async (
        payload: CreateBlogDto
    ): Promise<ApiResponse<BlogDto>> => {
        const response = await api.post('/blog', payload);
        return response.data;
    },

    // ✅ Cập nhật bài viết
    update: async (
        id: number,
        payload: UpdateBlogDto
    ): Promise<ApiResponse<null>> => {
        const response = await api.put(`/blog/${id}`, payload);
        return response.data;
    },

    // ✅ Xóa bài viết
    delete: async (id: number): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/blog/${id}`);
        return response.data;
    },
};

export default blogServices;