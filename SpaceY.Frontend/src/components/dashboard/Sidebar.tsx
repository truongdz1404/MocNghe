"use client";

import React from "react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import {
    ChevronRightIcon,
    ChevronDownIcon,
    CubeTransparentIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

export function SidebarWithLogo() {
    const [open, setOpen] = React.useState(0);
    const [openAlert, setOpenAlert] = React.useState(true);

    const handleOpen = (value: number) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <div className="h-[calc(100vh-2rem)] w-full max-w-[20rem] bg-white rounded-xl shadow-xl shadow-blue-gray-900/5 border border-blue-gray-50">
            {/* Header */}
            <div className="mb-2 flex items-center gap-4 p-4">
                <Image
                    src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
                    alt="brand"
                    className="h-8 w-8"
                />
                <h5 className="text-xl font-semibold text-blue-gray-900">
                    Sidebar
                </h5>
            </div>

            {/* Navigation List */}
            <nav className="flex flex-col">
                {/* Dashboard Accordion */}
                <div className="px-3">
                    <div className={`rounded-lg ${open === 1 ? 'bg-blue-gray-50' : ''}`}>
                        <button
                            onClick={() => handleOpen(1)}
                            className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors hover:bg-blue-gray-50 ${open === 1 ? 'bg-blue-gray-50 text-blue-gray-900' : 'text-blue-gray-700'
                                }`}
                        >
                            <PresentationChartBarIcon className="h-5 w-5" />
                            <span className="flex-1 font-normal">Dashboard</span>
                            <ChevronDownIcon
                                className={`h-4 w-4 transition-transform duration-200 ${open === 1 ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Accordion Body */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === 1 ? 'max-h-48 py-1' : 'max-h-0'
                            }`}>
                            <div className="pl-4">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Analytics</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Reporting</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Projects</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* E-Commerce Accordion */}
                <div className="px-3 mt-1">
                    <div className={`rounded-lg ${open === 2 ? 'bg-blue-gray-50' : ''}`}>
                        <button
                            onClick={() => handleOpen(2)}
                            className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors hover:bg-blue-gray-50 ${open === 2 ? 'bg-blue-gray-50 text-blue-gray-900' : 'text-blue-gray-700'
                                }`}
                        >
                            <ShoppingBagIcon className="h-5 w-5" />
                            <span className="flex-1 font-normal">E-Commerce</span>
                            <ChevronDownIcon
                                className={`h-4 w-4 transition-transform duration-200 ${open === 2 ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Accordion Body */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === 2 ? 'max-h-48 py-1' : 'max-h-0'
                            }`}>
                            <div className="pl-4">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Orders</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                                    <ChevronRightIcon className="h-3 w-5" strokeWidth={3} />
                                    <span className="text-sm">Products</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-2 mx-3 border-blue-gray-50" />

                {/* Regular Menu Items */}
                <div className="px-3 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <InboxIcon className="h-5 w-5" />
                        <span className="flex-1 font-normal">Inbox</span>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-blue-gray-600 bg-blue-gray-100 rounded-full">
                            14
                        </span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <UserCircleIcon className="h-5 w-5" />
                        <span className="font-normal">Profile</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span className="font-normal">Settings</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-blue-gray-700 hover:bg-blue-gray-50 transition-colors">
                        <PowerIcon className="h-5 w-5" />
                        <span className="font-normal">Log Out</span>
                    </button>
                </div>
            </nav>

            {/* Upgrade Alert */}
            {openAlert && (
                <div className="mt-auto mx-3 mb-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white relative">
                    <button
                        onClick={() => setOpenAlert(false)}
                        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>

                    <CubeTransparentIcon className="mb-4 h-12 w-12 text-white/80" />

                    <h6 className="text-lg font-semibold mb-1">
                        Upgrade to PRO
                    </h6>

                    <p className="text-sm text-white/80 font-normal mb-4 leading-relaxed">
                        Upgrade to Material Tailwind PRO and get even more components, plugins, advanced features and premium.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setOpenAlert(false)}
                            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                        >
                            Dismiss
                        </button>
                        <button className="text-sm font-medium text-white hover:text-white/90 transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}