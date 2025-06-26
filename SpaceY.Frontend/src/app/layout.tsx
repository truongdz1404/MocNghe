import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { MaterialTailwindProvider } from "@/components/MaterialTailwindProvider";
// import { AuthProvider } from "@/contexts/AuthContext";
const inter = Inter({ subsets: ['vietnamese'] });
export const metadata: Metadata = {
  title: "Mộc Nghệ Decor",
  description: "Không gian sống hiện đại",
  icons: "/assets/logo1.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f5f0e6]`}>
        {/* <AuthProvider> */}
          <MaterialTailwindProvider>
            {children}
          </MaterialTailwindProvider>
        {/* </AuthProvider> */}

      </body>
    </html>
  );
}