import { SidebarWithLogo } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
     <div className="flex h-screen w-full">
        <div className="h-full w-1/4 z-50">
          <SidebarWithLogo />
        </div>
        <div className="w-3/4">{children}</div>
     </div>
    
    </>
  );
}