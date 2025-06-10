import Image from "next/image";
import Branding from "@/layouts/Branding";
import { ThemeProvider } from "@/components/ThemeProvider";
export default function AuthLayout({ children , }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <div className="bg-[#f5f0e6] grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
          <div className="relative w-full">
            <div className="absolute top-0 bottom-0 left-0 right-0">
              <Image
                src="/assets/cutingcardImage.jpg"
                alt="Living Room Design with a Sofa"
                priority
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-background/60 md:to-background/40" />

              <Branding className="absolute left-8 top-8 z-20" />
            </div>
          </div>

          <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
            {children}
          </ThemeProvider>
        </div>
    </div>
  );
}
