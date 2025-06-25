import BlogList from '@/components/blog/BlogList';
import ExploreNewProduct from '@/components/home/ExploreNewProduct'
import ShopingByCategory from '@/components/home/ShopingByCategory'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';

export default function Home() {
  const now = new Date();

  // Lấy ngày, tháng, năm
  const day = now.getDate() + 3;
  const month = now.getMonth() + 1; // Lưu ý: getMonth() trả về 0–11

  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;

  console.log(formattedDate); // Ví dụ: "11/06/2025"

  return (
    <div>

      <div className="bg-[#f5f0e6] text-gray-800">
        <div className="container mx-auto p-4">
          <section className="flex flex-col md:flex-row items-center justify-between bg-[#f5f0e6] p-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">
                Chỉ 72 giờ: Giảm giá tới 40% cho dòng sản phẩm Tranh Gỗ
              </h1>
              <p className="text-lg mb-4">
                Chỉ trong ba ngày, giảm giá tới 40% cho tranh điêu khắc gỗ. Khuyến mãi kết thúc vào ngày {formattedDate}.
              </p>
              <Link className='bg-lime-900 text-white font-medium px-4 py-2 rounded' href='/collections/category/1'>MUA NGAY</Link>
             
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <Image alt="A shelf with a lamp and decorative items" height="400" 
                src="/assets/home-image.jpg" 
               width="600" />
            </div>
          </section>
          <ShopingByCategory />
          <div className='my-10'>
            <ExploreNewProduct />
          </div>
          <BlogList />
        </div>
        {/* <footer className="bg-[#f5f0e6] p-4">
          <div className="flex justify-center space-x-8">
            <img alt="The Times" height="50" src="https://storage.googleapis.com/a1aa/image/hvR8fMzc3vacncw9QXZFhvyI2XmRUW9peaUrKg6bAtg.jpg" width="100" />
            <img alt="House &amp; Garden" height="50" src="https://storage.googleapis.com/a1aa/image/ZsEQ5XYmonzxyIB17WG0KZ6RWCY03XflzofAKHu4bPo.jpg" width="100" />
            <img alt="AD" height="50" src="https://storage.googleapis.com/a1aa/image/knC4Q8m7NWFXI9WovDv-QCOOnPcvlAqbA8wyXjSPljY.jpg" width="100" />
            <img alt="The Telegraph" height="50" src="https://storage.googleapis.com/a1aa/image/mLV1iEJt6rZbbU9wCjb7ajbWnX99QEqlOPmKRD4kwYo.jpg" width="100" />
            <img alt="Financial Times" height="50" src="https://storage.googleapis.com/a1aa/image/NxDNKloaEXuWkaU9gsHwhX1Umz_ygZITA2cwcgNUmIc.jpg" width="100" />
            <img alt="dezeen" height="50" src="https://storage.googleapis.com/a1aa/image/JDAkc6JaANzfyQijBrYqVkGJyxQ-RP8y6YWX9wnt40s.jpg" width="100" />
          </div>
        </footer> */}
      </div>

      <div className="bg-gray-50 font-roboto">
        <div className="container mx-auto px-4 py-8">
         
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                Câu Chuyện Mộc Nghệ
              </h2>
              <p className="text-gray-600 mb-4">
                Mộc Nghệ bắt đầu từ niềm đam mê với vẻ đẹp mộc mạc, giản dị của gỗ tự nhiên. Chúng tôi tin rằng mỗi sản phẩm không chỉ là vật dụng trang trí, mà còn là một phần ký ức, cảm xúc và tinh thần sống chậm giữa cuộc sống hiện đại. Từng đường vân gỗ, từng chi tiết thủ công đều chứa đựng câu chuyện riêng – của người làm, của người dùng, và của không gian mà nó hiện diện.
              </p>
              {/* <button className="bg-gray-800 text-white px-4 py-2">
                Tìm Hiểu
              </button> */}
            </div>
            <div className="md:w-1/2">
              <Image alt="Wooden decor and packaging" className="w-full h-auto" height="400" src="https://storage.googleapis.com/a1aa/image/hPEvJa_VeQ22xqwGfQzHr4HkZMQY0uaEHzlvIJ22QLg.jpg" width="600" />
            </div>
          </div>

          <div className='my-20'>
            {/* <ShopingByRoom /> */}
          </div>

          {/* <div className="relative">
            <img alt="Commercial space with wooden decor" className="w-full h-auto" height="600" src="https://storage.googleapis.com/a1aa/image/tn8oZcKFrtMjky1bQsufelvqKDwFcrP5QploUp4YFZs.jpg" width="1200" />
            <div className="absolute bottom-0 left-0 bg-white bg-opacity-75 p-4">
              <h2 className="text-2xl font-bold mb-2">
                Moc Nghe Pro
              </h2>
              <button className="bg-gray-800 text-white px-4 py-2">
                Xem Thêm
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>

  )
}