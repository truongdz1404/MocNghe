'use client';

import AllProduct from '@/components/product/AllProduct';
import CategoryServices from '@/services/CategoryServices';
import { CategoryDto } from '@/types/category';
import { useEffect, useState } from 'react';

interface Props {
    id: number;
}

export default function ProductByCategory({ id }: Props) {
    const [category, setCategory] = useState<CategoryDto | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await CategoryServices.GetById(id);
                setCategory(response);
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };
        fetchCategory();
    }, [id]);

    return (
        <div>
            <div className="bg-gray-50 font-sans">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-sm text-gray-500 font-medium mb-4">
                        <a className="hover:underline mr-2" href="/">
                            Trang chủ
                        </a>
                        &gt;
                        <span className="ml-2 text-black">{category?.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 my-8">{category?.name}</h1>
                    <p className="text-black mb-8 w-1/2 font-medium">
                        Lọ hoa, tranh gỗ, combo quà tặng và nhiều hơn nữa. Đây là toàn bộ dòng sản phẩm Mộc Nghệ được tập hợp tại một nơi. Khám phá những mặt hàng được yêu thích từ lâu, chẳng hạn như bộ sản phẩm tranh khắc gỗ phổ biến của chúng tôi hoặc khám phá những sản phẩm mới nhất được bổ sung vào danh mục Mộc Nghệ.
                    </p>
                    <AllProduct categoryId={id} />
                </div>
            </div>
        </div>
    );
}