'use client'

import ProductServices from '@/services/ProductServices';
import { ProductDto } from '@/types/product';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function ExploreNewProduct() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                setLoading(true);
                const response = await ProductServices.GetPaginated({
                    pageNumber: 1,
                    pageSize: 4,
                    includeDeleted: false
                });

                // Filter only visible and non-deleted products
                const visibleProducts = response.data.filter(product => product.visible && !product.deleted);
                setProducts(visibleProducts.slice(0, 4)); // Ensure max 4 items
            } catch (err) {
                setError('Không thể tải sản phẩm mới');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []);


    if (loading) {
        return (
            <section className="mt-12 bg-[#f5f0e6] p-8">
                <h2 className="text-2xl text-black font-bold mb-4 text-center" >
                    KHÁM PHÁ SẢN PHẨM MỚI
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="relative animate-pulse">
                            <div className="bg-gray-300 w-full h-[300px] rounded"></div>
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 w-full">
                                <div className="bg-gray-400 h-4 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
          <></>
        );
    }

    return (
        <section className="mt-12 bg-[#f5f0e6] p-8">
            <h2 className="text-2xl text-black font-bold mb-4 text-center" >
                KHÁM PHÁ SẢN PHẨM MỚI
            </h2>
            <div className='text-center mb-8'>
                <Link href={"/collections/shop-all"} className=' w-full underline'>Xem Tất Cả</Link>

            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="relative cursor-pointer hover:opacity-90 transition-opacity">
                       <Link href={`/product/${product.id}`}>
                            <Image
                                alt={product.title}
                                src={(product.images[0].url)}
                                width={300}
                                height={300}
                                className="object-cover w-full h-[300px] rounded"
                            />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                <div className="font-medium">{product.title}</div>
                                {/* {product.price && (
                                <div className="text-sm text-yellow-300">
                                    {product.price.toLocaleString('vi-VN')} VND
                                </div>
                            )} */}
                            </div></Link>
                    </div>
                ))}
            </div>
        </section>
    );
}