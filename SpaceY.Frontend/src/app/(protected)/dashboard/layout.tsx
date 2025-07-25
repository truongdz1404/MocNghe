import { SidebarWithLogo } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
     <div className="flex h-screen w-full">
        <div className="h-screen w-1/5 z-50">
          <SidebarWithLogo />
        </div>
        <div className="w-4/5">{children}</div>
     </div>
    
    </>
  );
}