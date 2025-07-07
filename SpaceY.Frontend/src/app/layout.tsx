import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { MaterialTailwindProvider } from "@/components/MaterialTailwindProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: "Mộc Nghệ Decor",
    template: "%s | Mộc Nghệ Decor"
  },
  description: "Không gian sống hiện đại - Thiết kế nội thất cao cấp",
  keywords: ["nội thất", "decor", "thiết kế", "mộc nghệ", "không gian sống"],
  authors: [{ name: "Mộc Nghệ Decor" }],
  creator: "Mộc Nghệ Decor",
  publisher: "Mộc Nghệ Decor",
  icons: {
    icon: "/assets/logo1.png",
    apple: "/assets/logo1.png",
    shortcut: "/assets/logo1.png"
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://mocnghedecor.com'),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "Mộc Nghệ Decor",
    description: "Không gian sống hiện đại - Thiết kế nội thất cao cấp",
    siteName: "Mộc Nghệ Decor",
    images: [
      {
        url: "/assets/logo1.png",
        width: 1200,
        height: 630,
        alt: "Mộc Nghệ Decor"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mộc Nghệ Decor",
    description: "Không gian sống hiện đại - Thiết kế nội thất cao cấp",
    images: ["/assets/logo1.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f5f0e6" />
      </head>
      <body className={`${inter.className} bg-[#f5f0e6] antialiased`}>
        <GoogleAnalytics />
        <AuthProvider>
          <MaterialTailwindProvider>
            {children}
          </MaterialTailwindProvider>
        </AuthProvider>
      </body>
    </html>
  );
}