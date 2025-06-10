'use client'

import CategoryServices from '@/services/CategoryServices';
import { CategoryDto } from '@/types/category';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


export default function ShoppingByCategory() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await CategoryServices.GetPaginated({
                    pageNumber: 1,
                    pageSize: 4,
                    includeDeleted: false
                });

                const visibleCategories = response.data.filter(category => category.visible && !category.deleted);
                setCategories(visibleCategories.slice(0, 4)); 
            } catch (err) {
                setError('Failed to load categories');
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="mt-12">
                <h2 className="text-2xl font-bold text-center text-black mb-20">
                    MUA SẮM THEO DANH MỤC
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
        <section className="mt-12">
            <h2 className="text-2xl font-bold text-center text-black mb-20">
               MUA SẮM THEO DANH MỤC
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                   <Link href={`/collections/category/${category.id}`} key={category.id}>
                        <div key={category.id} className="relative cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                                alt={category.name}
                                src={(category.url || "/assets/lohoa1.png")}
                                width={300}
                                height={300}
                                className="object-cover w-full h-[300px] rounded"
                            />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2">
                                {category.name}
                            </div>
                        </div>
                   </Link>
                ))}
            </div>
        </section>
    );
}