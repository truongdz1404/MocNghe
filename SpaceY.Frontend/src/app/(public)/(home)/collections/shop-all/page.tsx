// import AllProduct from '@/components/product/AllProduct'
import AllProduct from '@/components/product/AllProduct'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className="bg-gray-50 font-sans">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-sm text-gray-500 font-medium mb-4">
                        <a className="hover:underline mr-2" href="/">
                            Trang chủ
                        </a>
                        &gt;
                        <span className='ml-2 text-black'>
                            Tất cả sản phẩm
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 my-8">
                        Tất Cả Sản Phẩm
                    </h1>
                    <p className="text-black mb-8 w-1/2 font-medium">
                        Lọ hoa, tranh gỗ, combo quà tặng và nhiều hơn nữa. Đây là toàn bộ dòng sản phẩm Mộc Nghệ được tập hợp tại một nơi. Khám phá những mặt hàng được yêu thích từ lâu, chẳng hạn như bộ sản phẩm tranh khắc gỗ phổ biến của chúng tôi hoặc khám phá những sản phẩm mới nhất được bổ sung vào danh mục Mộc Nghệ.</p>
                   
                    <AllProduct/>
                </div>
            </div>

        </div>
    )
}
