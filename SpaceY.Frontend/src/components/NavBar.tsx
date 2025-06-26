"use client"
import { LogOut, Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import MocNgheLogo from '../../public/assets/logo1.png';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function NavBar() {
    const router = useRouter();

    const { logout, isAuthenticated } = useAuth();

    // useEffect(() => {
    //     setIsClient(true);
    //     const token = localStorage.getItem('jwtToken');
    //     setIsLogin(!!token);
    // }, []);

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
                            <button onClick={handleLogout}>
                                <LogOut className='text-gray-800' />
                            </button>}
                    </div>
                </div>
            </header>
        </div>
    )
}