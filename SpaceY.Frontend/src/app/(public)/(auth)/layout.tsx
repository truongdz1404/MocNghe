import Image from "next/image";
import Branding from "@/layouts/Branding";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-blue-gray-50">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Panel - Image & Branding */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0">
            <Image
              src="/assets/cutingcardImage.jpg"
              alt="Living Room Design with a Sofa"
              priority
              fill
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-gray-800/70 to-gray-900/90" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
              <Branding className="z-20" />

              {/* Bottom Content */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Khám phá thế giới
                  <br />
                  decor đẳng cấp
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Tạo không gian sống hoàn hảo với bộ sưu tập đồ decor
                  cao cấp và dịch vụ tư vấn chuyên nghiệp.
                </p>

                {/* Decorative Elements */}
                <div className="flex space-x-2 pt-4">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Content */}
        <div className="flex items-center justify-center p-6 md:p-8 lg:p-12 md:col-span-2 lg:col-span-1">
          <div className="w-full max-w-md">
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {/* Mobile Branding */}
              <div className="md:hidden mb-8 text-center">
                <Branding className="justify-center" />
              </div>

              {/* Auth Form Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                {children}
              </div>

              {/* Footer */}
              {/* <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Bằng việc đăng nhập, bạn đồng ý với{" "}
                  <p className="text-blue-600 hover:text-blue-700 font-medium">
                    Điều khoản sử dụng
                  </p>{" "}
                  và{" "}
                  <p className="text-blue-600 hover:text-blue-700 font-medium">
                    Chính sách bảo mật
                  </p>
                </p>
              </div> */}
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}