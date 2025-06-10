'use client';

import { Typography } from "@material-tailwind/react";

const SITEMAP = [
  {
    title: "Sản Phẩm",
    links: ["Đồ Trang Trí Nhà", "Đồ Decor Phòng Ngủ", "Đồ Decor Phòng Khách", "Đồ Decor Văn Phòng", "Đồ Handmade", "Tranh Trang Trí"],
  },
  {
    title: "Danh Mục",
    links: ["Đèn Trang Trí", "Gương Decor", "Chậu Cây & Hoa", "Nến Thơm", "Khung Ảnh", "Tượng Trang Trí"],
  },
  {
    title: "Dịch Vụ",
    links: ["Tư Vấn Decor", "Thiết Kế Nội Thất", "Giao Hàng Tận Nơi", "Lắp Đặt Miễn Phí", "Bảo Hành", "Đổi Trả"],
  },
  {
    title: "Hỗ Trợ",
    links: ["Liên Hệ", "Hướng Dẫn Mua Hàng", "Chính Sách Vận Chuyển", "Phương Thức Thanh Toán", "Câu Hỏi Thường Gặp", "Khiếu Nại"],
  },
];

const currentYear = new Date().getFullYear();

export function FooterWithSitemap() {
  return (
    <footer className="relative w-full bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {SITEMAP.map(({ title, links }, key) => (
            <div key={key} className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-4 font-bold uppercase opacity-70"
              >
                {title}
              </Typography>
              <ul className="space-y-2">
                {links.map((link, key) => (
                  <Typography key={key} as="li" color="blue-gray" className="font-normal">
                    <a
                      href="#"
                      className="inline-block py-1 pr-2 transition-all hover:scale-105 hover:text-amber-600"
                    >
                      {link}
                    </a>
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Thông tin liên hệ */}
        <div className="border-t border-blue-gray-100 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold">
                Địa Chỉ Cửa Hàng
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal">
                123 Đường ABC, Quận 1<br />
                TP.HCM, Việt Nam
              </Typography>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold">
                Liên Hệ
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal">
                Hotline: 1900 1234<br />
                Email: info@decorstore.vn
              </Typography>
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold">
                Giờ Mở Cửa
              </Typography>
              <Typography variant="small" color="blue-gray" className="font-normal">
                T2-T7: 8:00 - 21:00<br />
                Chủ Nhật: 9:00 - 20:00
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center border-t border-blue-gray-100 py-6 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-blue-gray-900 md:mb-0"
          >
            &copy; {currentYear} <a href="#" className="text-amber-600 hover:text-amber-700">Decor Store</a>.
            Bản quyền thuộc về chúng tôi.
          </Typography>
          <div className="flex gap-4 text-blue-gray-900 sm:justify-center">
            {/* Facebook */}
            <Typography as="a" href="#" className="opacity-80 transition-all hover:opacity-100 hover:text-blue-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Typography>
            {/* Instagram */}
            <Typography as="a" href="#" className="opacity-80 transition-all hover:opacity-100 hover:text-pink-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </Typography>
            {/* Zalo */}
            <Typography as="a" href="#" className="opacity-80 transition-all hover:opacity-100 hover:text-blue-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </Typography>
            {/* YouTube */}
            <Typography as="a" href="#" className="opacity-80 transition-all hover:opacity-100 hover:text-red-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Typography>
            {/* TikTok */}
            <Typography as="a" href="#" className="opacity-80 transition-all hover:opacity-100 hover:text-black">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}