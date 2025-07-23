"use client"
import { Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import MocNgheLogo from '../../public/assets/logo1.png';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@/components/ui/MaterialTailwind';
import React from 'react';
import {
    Cog6ToothIcon,
    PowerIcon,
    UserCircleIcon,
} from "@heroicons/react/24/solid";

const profileMenuItems = [
    {
        label: "Thông Tin Cá Nhân",
        icon: UserCircleIcon,
        href: "/user/profile"
    },
    {
        label: "Lịch Sử Đặt Hàng",
        icon: Cog6ToothIcon,
        href: "/order/orderHistory"
    },
    {
        label: "Đăng Xuất",
        icon: PowerIcon,
    },
];
export default function NavBar() {
    const router = useRouter();

    const { logout, isAuthenticated } = useAuth();

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.push("/login");
        } else {
            router.push("/cart");
        }
    };
    const handleLogout = async () => {
        await logout();
    };

    return (
        <div>
            <div className="bg-[#f5f0e6] text-center p-2 font-semibold border-b border-gray-200">
                <a className="text-sm text-teal-900" href="#">
                    Khuyến mại mùa hè đang diễn ra | Mua ngay
                </a>
            </div>
            <header className="bg-gray-100 py-2">
                <div className="container mx-auto flex font-semibold text-md justify-between items-center">
                    <div className="flex space-x-4">
                        <Link href={"/collections/shop-all"} className='text-gray-800'>Shop</Link>
                        <a className="text-red-500" href="#">
                            Giảm Giá
                        </a>
                        <a className="text-gray-800" href="#">
                            Về Chúng Tôi
                        </a>
                    </div>
                    <div className='text-emerald-900 text-3xl font-serif ml-20'>
                        <Link href={"/"}>
                            <Image
                                src={MocNgheLogo}
                                alt="Mộc Nghệ Logo"
                                width={60}
                                height={60}
                                priority
                                className='rounded-full'
                            />
                        </Link>
                    </div>
                    <div className="flex items-center text-gray-800 space-x-4">
                        <Link href={"/collections/shop-all"} className='text-gray-800'>Cửa Hàng</Link>
                        <div className="relative">
                            <Link href={"/workspace"} className='text-gray-800'>Trải Nghiệm 2D</Link>
                        </div>

                        <Search className='text-gray-800' />
                        <button
                            onClick={handleCartClick}
                            className="text-gray-800 relative"
                        >
                            <ShoppingBag />
                            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs rounded-full px-1">
                                1
                            </span>
                        </button>

                        {!isAuthenticated
                            ? <Link href={"/login"}><User className='text-gray-800' /></Link>
                            :
                            // <button onClick={handleLogout}>
                            //     <LogOut className='text-gray-800' />
                            // </button>}
                            <AvatarWithUserDropdown handleLogout={handleLogout} />
                        }
                    </div>
                </div>
            </header>
        </div>
    )
}

interface AvatarWithUserDropdownProps {
    handleLogout: () => Promise<void>;
}

export function AvatarWithUserDropdown({ handleLogout }: AvatarWithUserDropdownProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const router = useRouter();
    const closeMenu = () => setIsMenuOpen(false);
    const handleMenuItemClick = async (item: typeof profileMenuItems[0]) => {
        closeMenu();
        if (item.label === "Đăng Xuất") {
            await handleLogout();
        }else if (item.href) {
            router.push(item.href)
        }
    }
    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center rounded-full p-0"
                >
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt="tania andrew"
                        withBorder={true}
                        color="blue-gray"
                        className=" p-0.5"
                        src="https://docs.material-tailwind.com/img/face-2.jpg"
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {profileMenuItems.map((item, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    return (
                        <MenuItem
                            key={item.label}
                            onClick={() => handleMenuItemClick(item)}
                            className={`flex items-center gap-2 rounded ${isLastItem
                                ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                                : ""
                                }`}
                        >
                            {React.createElement(item.icon, {
                                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                                color={isLastItem ? "red" : "inherit"}
                            >
                                {item.label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </MenuList>
        </Menu>
    );
}