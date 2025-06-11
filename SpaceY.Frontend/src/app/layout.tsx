import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { MaterialTailwindProvider } from "@/components/MaterialTailwindProvider";
const inter = Inter({ subsets: ['vietnamese'] });

export const metadata: Metadata = {
  title: "Moc Nghe Decor",
  description: "Không gian sống hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f5f0e6]`}>
        <MaterialTailwindProvider>
          {children}
        </MaterialTailwindProvider>
      </body>
    </html>
  );
}