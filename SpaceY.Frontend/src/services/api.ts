// services/api.ts
import envConfig from "@/config";
import axios from "axios";

const api = axios.create({
    baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true // Quan trọng: để gửi cookies
});

// Bỏ interceptor request vì không cần thêm token manual
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token sẽ tự động dùng cookies
                const refreshResponse = await api.post('/auth/refresh-token');

                if (refreshResponse.status === 200) {
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Redirect to login
                // if (typeof window !== 'undefined') {
                //     window.location.href = '/login';
                // }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;