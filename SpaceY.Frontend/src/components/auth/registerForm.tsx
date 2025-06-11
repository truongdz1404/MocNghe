"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  Typography,
  Input,
  Button,
  Alert,
} from "@/components/ui/MaterialTailwind";
import { z } from "zod";
import AuthServices from "@/services/AuthServices";
import { CreateUser } from "@/types/user";

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

// Zod schema for registration
const RegisterSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormType = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormType) {
    setIsLoading(true);
    setError("");

    try {
      const user: CreateUser = {
        email: values.email,
        password: values.password,
        fullName: values.email.split('@')[0],
      };

      const data = await AuthServices.SignUp(user);
      console.log("Đăng ký thành công:", data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (error: unknown) {
      console.error("Lỗi đăng ký:", error);
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Typography variant="h3" color="blue-gray" className="font-bold">
          Tạo Tài Khoản Mới
        </Typography>
        <Typography variant="paragraph" color="gray" className="font-normal">
         Nhập thông tin để tạo tài khoản
        </Typography>
      </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              label="Email"
              size="lg"
              {...register("email")}
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
              error={!!errors.email}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="mt-1 text-sm">
                {errors.email.message}
              </Typography>
            )}
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Mật khẩu"
              size="lg"
              {...register("password")}
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
              error={!!errors.password}
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
            {errors.password && (
              <Typography variant="small" color="red" className="mt-1 text-sm">
                {errors.password.message}
              </Typography>
            )}
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              label="Nhập lại mật khẩu"
              size="lg"
              {...register("confirmPassword")}
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
              error={!!errors.confirmPassword}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-gray-400 hover:text-blue-gray-600 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <Typography variant="small" color="red" className="mt-1 text-sm">
                {errors.confirmPassword.message}
              </Typography>
            )}
          </div>

          {error && (
            <Alert color="red" className="text-sm">
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            color="blue"
            fullWidth
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            className="mt-6"
          >
            {isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-blue-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-blue-gray-500 font-medium">
              Hoặc đăng ký bằng
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
            Đăng ký bằng Google
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
            Đăng ký bằng Facebook
          </Button>
        </div>

        {/* Sign In Link */}
      <div className="text-center flex items-center justify-center gap-1">
        <Typography variant="small" className="font-normal">
          Đã có tài khoản?
        </Typography>
        <Link href="/login">
          <Typography
            as="span"
            variant="small"
            color="blue"
            className="font-medium hover:text-blue-700 cursor-pointer"
          >
            Đăng nhập
          </Typography>
        </Link>
      </div>
      </div>
  );
}
