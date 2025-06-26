"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  Input,
  Checkbox,
  Button,
  Alert
} from "@/components/ui/MaterialTailwind";
import AuthServices from "@/services/AuthServices";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Facebook Icon Component
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      // if (response.token) {
      //   localStorage.setItem('token', response.token);
      // }

      router.push('/');

    } catch (error: unknown) {
      console.error("Lỗi đăng nhập:", error);

      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Typography variant="h3" color="blue-gray" className="font-bold">
          Chào Mừng Trở Lại
        </Typography>
        <Typography variant="paragraph" color="gray" className="font-normal">
          Đăng nhập để tiếp tục với tài khoản của bạn
        </Typography>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            label="Email"
            size="lg"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            crossOrigin={undefined}
            className="!border-blue-gray-200 focus:!border-blue-500"
            labelProps={{
              className:
                "text-blue-gray-600 peer-focus:text-blue-500 transition-all duration-300",
            }}
            containerProps={{
              className: "min-w-[200px]",
            }}
          />
        </div>

        <div className="relative mt-4">
          <Input
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            size="lg"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            crossOrigin={undefined}
            className="!border-blue-gray-200 focus:!border-blue-500 pr-10"
            labelProps={{
              className:
                "text-blue-gray-600 peer-focus:text-blue-500 transition-all duration-300",
            }}
            containerProps={{
              className: "min-w-[200px]",
            }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-gray-400 hover:text-blue-gray-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && (
          <Alert color="red" className="text-sm">
            {error}
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                Ghi nhớ đăng nhập
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
            crossOrigin={undefined}
          />
          <Link href="/forgot-password">
            <Typography
              variant="small"
              color="blue"
              className="font-medium hover:text-blue-700 cursor-pointer"
            >
              Quên mật khẩu?
            </Typography>
          </Link>
        </div>

        <Button
          type="submit"
          color="blue"
          fullWidth
          size="lg"
          loading={isLoading}
          disabled={isLoading}
          className="mt-6"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-blue-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-blue-gray-500 font-medium">
            Hoặc đăng nhập bằng
          </span>
        </div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <Button
          variant="outlined"
          color="blue-gray"
          fullWidth
          size="lg"
          className="flex items-center justify-center gap-3 hover:bg-blue-gray-50"
          disabled={isLoading}
        >
          <GoogleIcon />
          Đăng nhập bằng Google
        </Button>

        <Button
          variant="outlined"
          color="blue-gray"
          fullWidth
          size="lg"
          className="flex items-center justify-center gap-3 hover:bg-blue-gray-50"
          disabled={isLoading}
        >
          <FacebookIcon />
          Đăng nhập bằng Facebook
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center flex items-center justify-center gap-1">
        <Typography variant="small" className="font-normal">
          Chưa có tài khoản?
        </Typography>
        <Link href="/register">
          <Typography
            as="span"
            variant="small"
            color="blue"
            className="font-medium hover:text-blue-700 cursor-pointer"
          >
            Đăng ký ngay
          </Typography>
        </Link>
      </div>
    </div>
  );
}