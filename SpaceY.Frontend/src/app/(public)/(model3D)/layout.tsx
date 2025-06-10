// import SideNav from "@/components/SideNav";
export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="m-0 font-sans antialiased font-normal text-base leading-default bg-gray-50 text-slate-500">
                {/* <div className="max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent">
                    <SideNav />
                </div> */}
                <main>{children}</main>
            </div>
        </>
    );
}