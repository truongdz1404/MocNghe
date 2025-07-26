"use client";

import React from "react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    // InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import {
    ChevronRightIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
// import Image from "next/image";

export function SidebarWithLogo() {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value: number) => {
        setOpen(open === value ? 0 : value);
    };

    // Sửa lại để lấy đúng logout function từ useAuth hook
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="h-[calc(100vh-32px)] w-full max-w-[20rem] bg-white rounded-xl shadow-xl shadow-blue-gray-900/5 border border-blue-gray-50 flex flex-col">
            {/* Header */}
            <div className="mb-2 flex items-center gap-4 p-4">
                {/* <Image
                    src=""
                    alt="brand"
                    height={32}
                    width={32}
                    className="h-8 w-8"
                /> */}
                <h5 className="text-xl font-semibold text-blue-gray-900">
                    Admin
                </h5>
            </div>

            {/* Navigation List - flex-1 để content chiếm hết không gian còn lại */}
            <nav className="flex flex-col flex-1">
                {/* Dashboard Accordion */}
                <div className="px-3">
                    <div className={`rounded-lg ${open === 1 ? 'bg-blue-gray-50' : ''}`}>
                        <Link href="/dashboard"
                            onClick={() => handleOpen(1)}
                            className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors hover:bg-blue-gray-50 ${open === 1 ? 'bg-blue-gray-50 text-blue-gray-900' : 'text-blue-gray-700'
                                }`}
                        >
                            <PresentationChartBarIcon className="h-5 w-5" />
                            <span className="flex-1 font-normal">Dashboard</span>
                        </Link>
                    </div>
                </div>

                {/* E-Commerce Accordion */}
                <div className="px-3 mt-1">
                    <div className={`rounded-lg ${open === 2 ? 'bg-blue-gray-50' : ''}`}>
                        <button
                            onClick={() => handleOpen(2)}
                            className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors hover:bg-blue-gray-50 ${open === 2 ? 'bg-blue-gray-50 text-blue-gray-900' : 'text-blue-gray-700'
                                }`}
                        >
                            <ShoppingBagIcon className="h-5 w-5" />
                            <span className="flex-1 font-normal">Quản Lí</span>
                            <ChevronDownIcon
                                className={`h-4 w-4 transition-transform duration-200 ${open === 2 ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Accordion Body */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === 2 ? 'max-h-48 py-1' : 'max-h-0'
                            }`}>
                            <div className="pl-4">
                                <Link href="/dashboard/order" className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Đơn Hàng</span>
                                </Link>
                                <Link href={"/dashboard/product"} className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Sản Phẩm</span>
                                </Link>
                                <Link href={"/dashboard/category"} className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Danh Mục</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-2 mx-3 border-blue-gray-50" />

                {/* Regular Menu Items */}
                <div className="px-3 space-y-1">
                    {/* <button className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <InboxIcon className="h-5 w-5" />
                        <span className="flex-1 font-normal">Inbox</span>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-blue-gray-600 bg-blue-gray-100 rounded-full">
                            14
                        </span>
                    </button> */}

                    <Link href={"/dashboard/customer"} className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <UserCircleIcon className="h-5 w-5" />
                        <span className="font-normal">Người Dùng</span>
                    </Link>
                </div>

                {/* Spacer để đẩy phần dưới xuống cuối sidebar */}
                <div className="flex-1"></div>

                {/* Bottom Actions - được đặt ở cuối sidebar */}
                <div className="px-3 space-y-1 pb-4">
                    <hr className="my-2 border-blue-gray-50" />

                    <Link href="/" className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-normal">Back To Home</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                    >
                        <PowerIcon className="h-5 w-5" />
                        <span className="font-normal">Log Out</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}