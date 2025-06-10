"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCircleIcon as GoogleIcon,
  ChatBubbleLeftIcon as FacebookIcon,
} from "@heroicons/react/24/outline";
import AuthServices from "@/services/AuthServices";


export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginData = {
        email: formData.email,
        password: formData.password
      };

      const response = await AuthServices.SignIn(loginData);

      console.log("Đăng nhập thành công:", response);

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      router.push('/');

    }
    catch (error: unknown) {
      console.error("Lỗi đăng nhập:", error);

      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    }
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f0e6] flex justify-center items-center min-h-screen text-black">
      <div className="shadow-lg rounded-lg flex max-w-4xl w-full">
        <div className="w-2/3 p-8 mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Chào Mừng Bạn Trở Lại</h2>
            <p className="text-gray-600 mb-6">Nhập thông tin tài khoản của bạn</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="w-full border border-white rounded-lg py-2 px-4 mb-4 bg-white autofill:bg-white"
              placeholder="Email hoặc tên người dùng"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <input
              className="w-full border border-white rounded-lg py-2 px-4 mb-4 bg-white"
              placeholder="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-gray-600">
                <input
                  className="mr-2"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                Giữ tôi đăng nhập
              </label>
              <Link className="text-gray-600 hover:underline" href="/forgot-password">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white text-center rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-500" />
            <span className="px-2 text-gray-500">HOẶC</span>
            <hr className="flex-grow border-gray-500" />
          </div>

          <button className="w-full flex items-center justify-center text-gray-700 bg-white border border-white rounded-lg py-2 mb-4">
            <GoogleIcon className="h-5 w-5 mr-2" />
            Đăng nhập bằng Google
          </button>

          <button className="w-full flex items-center justify-center text-gray-700 bg-white border border-white rounded-lg py-2 mb-4">
            <FacebookIcon className="h-5 w-5 mr-2" />
            Đăng nhập bằng Facebook
          </button>

          <div className="flex justify-between items-center mb-8 mt-2">
            <span className="text-gray-600">Chưa có tài khoản?</span>
            <Link className="text-gray-600 hover:underline" href="/register">
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}