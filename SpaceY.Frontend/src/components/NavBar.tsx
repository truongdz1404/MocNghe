"use client"
import { Search, ShoppingBag, User } from 'lucide-react'
import Link from 'next/link'
// import React, { useState } from 'react'

export default function NavBar() {
    // const [isShopHovered, setIsShopHovered] = useState(false)

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
                    <div className='text-emerald-900 text-3xl font-serif'>
                        <Link href={"/"}> Mộc Nghệ</Link>
                    </div>
                    <div className="flex items-center text-gray-800 space-x-4">
                        <Link href={"/collections/shop-all"} className='text-gray-800'>Cửa Hàng</Link>
                        <div className="relative">
                           <Link href={"/workspace"} className='text-gray-800'>Trải Nghiệm 3D</Link>
                        </div>
                        <Link href={"/login"}><User className='text-gray-800' /></Link>
                        <Search className='text-gray-800' />
                        <a className="text-gray-800 relative" href="#">
                            <ShoppingBag />
                            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs rounded-full px-1">
                                1
                            </span>
                        </a>
                    </div>
                </div>
            </header>
        </div>
    )
}

