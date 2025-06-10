// import React from 'react'

// export default function ShopingByRoom() {
//   return (
//       <div className="mb-8">
//           <h2 className="text-2xl font-bold mb-4">
//               Mua sắm theo phòng
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="relative">
//                   <img alt="Bathroom with wooden decor" className="w-full h-auto" height="200" src="https://storage.googleapis.com/a1aa/image/B2cdnpI6mbKvL9NFQFE9CfT6OR90X5zAtzaq1QIEN04.jpg" width="300" />
//                   <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-2 w-full text-center">
//                       Phòng Tắm
//                   </div>
//               </div>
//               <div className="relative">
//                   <img alt="Bedroom with wooden decor" className="w-full h-auto" height="200" src="https://storage.googleapis.com/a1aa/image/nIhwSWuhmGh6ZqQJlhXmlE6b9L1I480aFCHkhtijeOo.jpg" width="300" />
//                   <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-2 w-full text-center">
//                       Phòng Ngủ
//                   </div>
//               </div>
//               <div className="relative">
//                   <img alt="Kitchen with wooden decor" className="w-full h-auto" height="200" src="https://storage.googleapis.com/a1aa/image/J_cblUoZFpNJ0JsqI_K_j8zxXHywq_wFjhzivXE5cIQ.jpg" width="300" />
//                   <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-2 w-full text-center">
//                       Phòng Bếp
//                   </div>
//               </div>
//               <div className="relative">
//                   <img alt="Living room with wooden decor" className="w-full h-auto" height="200" src="https://storage.googleapis.com/a1aa/image/XV2621DaI4A5LmVwAsnLIMj7OCRXfLCoH7faUNYi-rg.jpg" width="300" />
//                   <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-2 w-full text-center">
//                       Phòng Khách
//                   </div>
//               </div>
//           </div>
//       </div>
//   )
// }
'use client'

import CategoryServices from '@/services/CategoryServices';
import { CategoryDto } from '@/types/category';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


export default function ShoppingByRoom() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await CategoryServices.GetCategoryRoom();

                const visibleCategories = response.filter(category => category.visible && !category.deleted);
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
                <h2 className="text-2xl font-bold mb-4">
                    Mua sắm theo phòng
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
            <h2 className="text-2xl font-bold mb-4">
                Mua sắm theo phòng
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
                        </div>
                        <div className=" bg-white bg-opacity-75 font-medium p-2 w-full text-left hover:underline">
                            {category.name}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}