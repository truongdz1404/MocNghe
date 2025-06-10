"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserCircleIcon as GoogleIcon,
    ChatBubbleLeftIcon as FacebookIcon,
} from "@heroicons/react/24/outline";
import { z } from "zod";
import AuthServices from "@/services/AuthServices";
import { CreateUser } from "@/types/user";

// Tạo schema mới chỉ với email, password và confirmPassword
const RegisterSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

type RegisterFormType = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const form = useForm<RegisterFormType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    async function onSubmit(values: RegisterFormType) {
        console.log("Form submitted with values:", values); // Debug log

        setIsLoading(true);
        setError("");

        try {
            const user: CreateUser = {
                email: values.email,
                password: values.password,
                fullName: values.email.split('@')[0], // Tạo fullName từ email
            };

            console.log("Calling API with user:", user); // Debug log
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
        <div className="bg-[#f5f0e6] flex justify-center items-center min-h-screen text-black">
            <div className="shadow-lg rounded-lg flex max-w-4xl w-full">
                <div className="w-2/3 p-8 mx-auto">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Tạo Tài Khoản Mới</h2>
                        <p className="text-gray-600 mb-6">Nhập thông tin để tạo tài khoản</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                        console.log("Form validation errors:", errors); // Debug log
                    })} noValidate>

                        <input
                            className="w-full border border-white rounded-lg py-2 px-4 mb-4 bg-white autofill:bg-white"
                            placeholder="Email"
                            type="email"
                            {...form.register("email")}
                            disabled={isLoading}
                        />
                        {form.formState.errors.email && (
                            <p className="text-red-500 text-sm mb-2 -mt-2">
                                {form.formState.errors.email.message}
                            </p>
                        )}

                        <input
                            className="w-full border border-white rounded-lg py-2 px-4 mb-4 bg-white"
                            placeholder="Mật khẩu"
                            type="password"
                            {...form.register("password")}
                            disabled={isLoading}
                        />
                        {form.formState.errors.password && (
                            <p className="text-red-500 text-sm mb-2 -mt-2">
                                {form.formState.errors.password.message}
                            </p>
                        )}

                        <input
                            className="w-full border border-white rounded-lg py-2 px-4 mb-4 bg-white"
                            placeholder="Nhập lại mật khẩu"
                            type="password"
                            {...form.register("confirmPassword")}
                            disabled={isLoading}
                        />
                        {form.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mb-2 -mt-2">
                                {form.formState.errors.confirmPassword.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-black text-white text-center rounded-lg py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                        </button>
                    </form>

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-500" />
                        <span className="px-2 text-gray-500">HOẶC</span>
                        <hr className="flex-grow border-gray-500" />
                    </div>

                    <button className="w-full flex items-center justify-center text-gray-700 bg-white border border-white rounded-lg py-2 mb-4">
                        <GoogleIcon className="h-5 w-5 mr-2" />
                        Đăng ký bằng Google
                    </button>

                    <button className="w-full flex items-center justify-center text-gray-700 bg-white border border-white rounded-lg py-2 mb-4">
                        <FacebookIcon className="h-5 w-5 mr-2" />
                        Đăng ký bằng Facebook
                    </button>

                    <div className="flex justify-between items-center mb-8 mt-2">
                        <span className="text-gray-600">Đã có tài khoản?</span>
                        <Link className="text-gray-600 hover:underline" href="/login">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}