import NavBar from "@/components/NavBar";
import { FooterWithSitemap } from "@/layouts/MainFooter";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />

      </div>
      <main className="pt-24">{children}</main>
      <div className="py-5">
        <FooterWithSitemap />
      </div>
    </>
  );
}