'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import {
    Button,
    IconButton,
    Badge,
    Input,
} from '@/components/ui/MaterialTailwind';

// Import icons từ Heroicons
import {
    Bars3Icon,
    ArrowUpTrayIcon,
    QuestionMarkCircleIcon,
    BellIcon,
    UserCircleIcon,
    StarIcon,
    ChatBubbleLeftIcon,
    CubeIcon,
    Squares2X2Icon,
    ChartBarIcon,
    FolderIcon,
    ViewColumnsIcon,
    SquaresPlusIcon,
    AdjustmentsHorizontalIcon,
    Cog6ToothIcon,
    ArrowsPointingOutIcon,
    LightBulbIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    RocketLaunchIcon,
    GiftIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';


const SIDEBAR_ICONS = [
    CubeIcon,
    Squares2X2Icon,
    ChartBarIcon,
    ChatBubbleLeftIcon,
    AdjustmentsHorizontalIcon,
];

const TOOLBAR_ICONS = [
    FolderIcon,
    ViewColumnsIcon,
    SquaresPlusIcon,
    CubeIcon,
    AdjustmentsHorizontalIcon,
    Cog6ToothIcon,
    ArrowsPointingOutIcon,
];

interface SidebarProps {
    isOpen: boolean;
  }


// interface LeftPanelProps {
//     prompt: string;
//     setPrompt: (prompt: string) => void;
//     tabValue: number;
//     setTabValue: (tabValue: number) => void;
//   }
// Component con cho Sidebar
const Sidebar = ({ isOpen }: SidebarProps) => (
    <div className={`${isOpen ? 'w-16' : 'w-0'
        } bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 transition-all duration-300`}>
        <div className="flex flex-col items-center space-y-6">
            {SIDEBAR_ICONS.map((Icon, index) => (
                <IconButton key={index}  className="text-gray-400 hover:text-white">
                    <Icon className="h-6 w-6" />
                </IconButton>
            ))}
        </div>
    </div>
);

// Component con cho Header
const Header = () => (
    <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
            <IconButton className="text-gray-400">
                <Bars3Icon className="h-6 w-6" />
            </IconButton>

            {/* <div className="flex items-center gap-1">
                <span className="text-amber-300">🪙</span>
                <span className="text-white font-medium">200</span>
            </div> */}

            {/* <Button
                className="bg-green-600 hover:bg-green-700 text-white"
            >
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Nhận tín dụng
            </Button> */}

            <IconButton  className="text-gray-400">
                <GiftIcon className="h-6 w-6" />
            </IconButton>
        </div>

        <div className="flex items-center gap-2">
            <IconButton className="text-gray-400">
                <QuestionMarkCircleIcon className="h-6 w-6" />
            </IconButton>

            <IconButton  className="text-gray-400">
                <Badge>
                    <BellIcon className="h-6 w-6" />
                </Badge>
            </IconButton>

            <IconButton  className="text-purple-400">
                <UserCircleIcon className="h-6 w-6" />
            </IconButton>
        </div>
    </div>
);

// Component con cho Left Panel
const LeftPanel = () => (
    <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-400">Mô hình mới</h1>
            <Button
                className="bg-green-400 hover:bg-green-500 text-gray-900"
            >
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                Tải lên
            </Button>
        </div>

        {/* Tabs */}
        {/* <div className="p-4 border-b border-gray-800">
            <Tabs
                value={tabValue}
                onChange={(e : React.ChangeEvent, newValue : number) => setTabValue(newValue)}
                variant="fullWidth"
                className="bg-gray-800 rounded-lg"
            >
                {TABS.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        icon={<tab.icon className="h-5 w-5" />}
                        className={`${tabValue === index ? 'bg-gray-700 text-white' : 'text-gray-400'
                            }`}
                    />
                ))}
            </Tabs>
        </div> */}

        {/* Input Area */}
        <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-400 font-medium">Lời nhắc</h3>
                <div className="flex gap-2">
                    <Button  className="text-blue-400 hover:text-blue-300">
                        Ví dụ
                    </Button>
                    <Button  className="text-blue-400 hover:text-blue-300">
                        Hướng dẫn
                    </Button>
                </div>
            </div>

            {/* <Input
                placeholder="Nhập những gì bạn muốn tạo. Bạn có thể dùng ngôn ngữ mẹ đẻ, ví dụ: một chú chó dễ thương/ein süßer Hund/un chien mignon/一只可爱的小狗/かわいい犬/귀여운 개."
                variant="outlined"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-gray-800 rounded-lg text-white"
                InputProps={{
                    endAdornment: (
                        <div className="text-gray-500 text-xs">
                            {prompt.length}/500
                        </div>
                    ),
                }}
            /> */}

            <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                    <IconButton  className="text-gray-400 hover:text-white">
                        <LightBulbIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton  className="text-gray-400 hover:text-white">
                        <StarIcon className="h-5 w-5" />
                    </IconButton>
                </div>
                <div className="text-yellow-500 text-sm font-medium">#Không gian 3D#</div>
            </div>
        </div>

        {/* Model Selection */}
        <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
                <h3 className="text-gray-200 font-medium">Mô hình AI</h3>
                <div className="flex items-center px-3 py-1 rounded-full bg-gray-800 text-white cursor-pointer hover:bg-gray-700">
                    Meshy-4 <span className="ml-2">▼</span>
                </div>
            </div>
        </div>

        {/* License */}
        <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
                <h3 className="text-gray-200 font-medium">Giấy phép</h3>
                <div className="h-4 w-8 rounded-full bg-gray-700 cursor-pointer"></div>
            </div>
        </div>

        {/* Generate Button */}
        <div className="p-4 mt-auto">
            <div className="flex justify-between items-center mb-2">
                <div className="text-gray-300">1 phút</div>
                <div className="flex items-center gap-1">
                    <span className="text-amber-300">🪙</span>
                    <span className="text-white font-medium">10</span>
                </div>
            </div>
            <Button
                
                fullWidth
                className="bg-gradient-to-r from-green-400 to-pink-400 hover:from-green-500 hover:to-pink-500 text-white py-3 font-medium"
            >
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                Tạo
            </Button>
        </div>
    </div>
);

// Component con cho 3D Viewer
const MainViewer = () => (
    <div className="flex-1 relative">
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Image
                src="/assets/room.jpg"
                alt="Mô hình 3D"
                width={800}
                height={600}
                className="rounded-lg shadow-2xl"
            />
        </div>

        {/* Toolbar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 bg-gray-800 rounded-lg p-2 shadow-lg">
            {TOOLBAR_ICONS.map((Icon, index) => (
                <IconButton
                    key={index}
                    
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                >
                    <Icon className="h-5 w-5" />
                </IconButton>
            ))}
        </div>
    </div>
);

// Component con cho Right Panel
const RightPanel = () => (
    <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col">
        {/* Promotion */}
        <div className="p-4 border-b border-gray-800">
            <div className="bg-gray-800 text-blue-400 rounded-lg p-4">
                <p className="text-sm mb-3">
                    Xem thêm các sản phẩm decor của Mộc Nghệ, và trải nghiệm nhiều hơn thế nữa!
                </p>
                <Button
                    
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    
                >
                    <RocketLaunchIcon className="h-4 w-4 mr-2" />
                    Mua Hàng
                </Button>
            </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center gap-2">
                <Input
                    placeholder="Tìm kiếm thế hệ của tôi"
                    variant="outlined"
                    
                    className="bg-gray-800 rounded-lg flex-1"
                    InputProps={{
                        startAdornment: (
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                        ),
                    }}
                />
                <Button className="text-blue-400 hover:text-blue-300" >
                    Tài sản cũ
                </Button>
            </div>
        </div>

        {/* Gallery */}
        <div className="p-4 flex-1">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-200 font-medium">Thiết kế phòng ngủ hiện đại</h3>
                <div className="text-gray-400 text-sm cursor-pointer hover:text-white">
                    Tất cả 2 tài sản ▶
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        <Image
                            src="/assets/room2.jpg"
                            alt={`Mô hình 3D ${item}`}
                            width={150}
                            height={120}
                            className="w-full h-24 object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                    <IconButton  className="text-gray-400 hover:text-white">
                        <ChevronLeftIcon className="h-4 w-4" />
                    </IconButton>
                    <span className="text-sm">1/1</span>
                    <IconButton  className="text-gray-400 hover:text-white">
                        <ChevronRightIcon className="h-4 w-4" />
                    </IconButton>
                </div>
            </div>
        </div>
    </div>
);

// Main Component
export default function Page() {
    const [prompt, setPrompt] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Head>
                <title>Trình tạo mô hình 3D</title>
                <meta name="description" content="Tạo mô hình 3D từ văn bản hoặc hình ảnh" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Sidebar isOpen={sidebarOpen} />

            <LeftPanel
                prompt={prompt}
                setPrompt={setPrompt}
                tabValue={tabValue}
                setTabValue={setTabValue}
            />

            <div className="flex-1 flex flex-col">
                <Header />
                <MainViewer />
            </div>

            <RightPanel />
        </div>
    );
}