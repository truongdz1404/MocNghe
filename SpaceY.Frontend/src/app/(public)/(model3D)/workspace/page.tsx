'use client';
import { useState } from 'react';
import Head from 'next/head';
import {
    Button,
    Tab,
    Tabs,
    IconButton,
    Badge,
    Input,
} from '@material-tailwind/react';

// Nhập các biểu tượng từ Heroicons
import {
    Bars3Icon as MenuIcon,
    ArrowUpTrayIcon as UploadIcon,
    QuestionMarkCircleIcon as HelpOutlineIcon,
    BellIcon as NotificationsIcon,
    UserCircleIcon as AccountCircleIcon,
    StarIcon,
    PencilSquareIcon as InputsIcon,
    PhotoIcon as ImageIcon,
    ChatBubbleLeftIcon as ChatBubbleOutlineIcon,
    CubeIcon as ViewInArIcon,
    Squares2X2Icon as CategoryIcon,
    ChartBarIcon as EqualizerIcon,
    FolderIcon,
    ViewColumnsIcon as GridViewIcon,
    SquaresPlusIcon as ViewModuleIcon,
    CubeIcon as CubeIcon,
    AdjustmentsHorizontalIcon as TuneIcon,
    Cog6ToothIcon as SettingsIcon,
    ArrowsPointingOutIcon as FullscreenIcon,
    LightBulbIcon as LightbulbIcon,
    // QuoteIcon as FormatQuoteIcon,
    ChevronLeftIcon as ArrowBackIosNewIcon,
    ChevronRightIcon as ArrowForwardIosIcon,
    RocketLaunchIcon,
    GiftIcon as CardGiftcardIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function page() {
    const [prompt, setPrompt] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentModelIndex, setCurrentModelIndex] = useState(0);

    const models = [
        {
            name: 'Thiết kế phòng ngủ hiện đại',
            thumbnail: '/bedroom-model.jpg',
        },
        {
            name: 'Thiết kế phòng tắm',
            thumbnail: '/bathroom-model.jpg',
        }
    ];

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            <Head>
                <title>Trình tạo mô hình 3D</title>
                <meta name="description" content="Tạo mô hình 3D từ văn bản hoặc hình ảnh" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Thanh bên */}
            <div className={`${sidebarOpen ? 'w-16' : 'w-0'} bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 transition-all`}>
                <div className="flex flex-col items-center space-y-6">
                    <IconButton color="inherit">
                        <ViewInArIcon className="h-6 w-6" />
                    </IconButton>
                    <IconButton color="inherit">
                        <CategoryIcon className="h-6 w-6" />
                    </IconButton>
                    <IconButton color="inherit">
                        <EqualizerIcon className="h-6 w-6" />
                    </IconButton>
                    <IconButton color="inherit">
                        <ChatBubbleOutlineIcon className="h-6 w-6" />
                    </IconButton>
                    <IconButton color="inherit">
                        <TuneIcon className="h-6 w-6" />
                    </IconButton>
                </div>
            </div>

            {/* Bảng điều khiển bên trái */}
            <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-green-400">Mô hình mới</h1>
                    <Button
                        variant="contained"
                        startIcon={<UploadIcon className="h-5 w-5" />}
                        className="bg-green-400 hover:bg-green-500 text-gray-900"
                    >
                        Tải lên
                    </Button>
                </div>

                {/* Điều hướng Tab */}
                <div className="p-4 border-b border-gray-800">
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        variant="fullWidth"
                        className="bg-gray-800 rounded-lg"
                    >
                        <Tab
                            label="Văn bản thành 3D"
                            icon={<InputsIcon className="h-5 w-5" />}
                            className={`${tabValue === 0 ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                        />
                        <Tab
                            label="Hình ảnh thành 3D"
                            icon={<ImageIcon className="h-5 w-5" />}
                            className={`${tabValue === 1 ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                        />
                    </Tabs>
                </div>

                {/* Khu vực nhập liệu */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-gray-400">Lời nhắc</h3>
                        <div className="flex gap-2">
                            <Button size="small" className="text-blue-400">Ví dụ</Button>
                            <Button size="small" className="text-blue-400">Hướng dẫn</Button>
                        </div>
                    </div>
                    <Input
                        multiline
                        rows={4}
                        placeholder="Nhập những gì bạn muốn tạo. Bạn có thể dùng ngôn ngữ mẹ đẻ, ví dụ: một chú chó dễ thương/ein süßer Hund/un chien mignon/一只可爱的小狗/かわいい犬/귀여운 개."
                        variant="outlined"
                        fullWidth
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-gray-800 rounded-lg text-white"
                        InputProps={{
                            endAdornment: (
                                <div className="text-gray-500 text-xs">{prompt.length}/500</div>
                            ),
                        }}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-2">
                            <IconButton size="small" className="text-gray-400">
                                {/* <FormatQuoteIcon className="h-5 w-5" /> */}
                            </IconButton>
                            <IconButton size="small" className="text-gray-400">
                                <LightbulbIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton size="small" className="text-gray-400">
                                <StarIcon className="h-5 w-5" />
                            </IconButton>
                        </div>
                        <div className="text-yellow-500">#Không gian 3D#</div>
                    </div>
                </div>

                {/* Chọn mô hình */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-200">Mô hình AI</h3>
                        <div className="flex items-center px-3 py-1 rounded-full bg-gray-800 text-white">
                            Meshy-4 <span className="ml-2">▼</span>
                        </div>
                    </div>
                </div>

                {/* Giấy phép */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-200">Giấy phép</h3>
                        <div className="h-4 w-8 rounded-full bg-gray-700"></div>
                    </div>
                </div>

                {/* Nút tạo */}
                <div className="p-4 mt-auto">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-300">1 phút</div>
                        <div className="flex items-center">
                            <span className="text-amber-300 mr-1">🪙</span>
                            <span className="text-white">10</span>
                        </div>
                    </div>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<RocketLaunchIcon className="h-5 w-5" />}
                        className="bg-gradient-to-r from-green-400 to-pink-400 text-white py-3"
                    >
                        Tạo
                    </Button>
                </div>
            </div>

            {/* Khu vực nội dung chính */}
            <div className="flex-1 flex flex-col">
                {/* Điều hướng trên cùng */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <div className="flex gap-4">
                        <IconButton color="inherit">
                            <MenuIcon className="h-6 w-6" />
                        </IconButton>
                        <div className="flex items-center">
                            <span className="text-amber-300 mr-1">🪙</span>
                            <span className="text-white">200</span>
                        </div>
                        <Button
                            variant="contained"
                            startIcon={<RocketLaunchIcon className="h-5 w-5" />}
                            className="bg-green-600 text-white"
                        >
                            Nhận tín dụng
                        </Button>
                        <IconButton color="inherit">
                            <CardGiftcardIcon className="h-6 w-6" />
                        </IconButton>
                    </div>

                    <div className="flex gap-2">
                        <IconButton color="inherit">
                            <HelpOutlineIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit">
                            <Badge badgeContent={1} color="error">
                                <NotificationsIcon className="h-6 w-6" />
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit">
                            <AccountCircleIcon className="h-6 w-6 text-purple-400" />
                        </IconButton>
                    </div>
                </div>

                {/* Chế độ xem 3D chính */}
                <div className="flex-1 relative">
                    <div className="w-full h-full grid place-items-center text-gray-400">
                        <Image src="/assets/room.jpg" alt="Mô hình 3D" width={800} height={800} />
                    </div>

                    {/* Công cụ */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-800 rounded-lg p-1">
                        <IconButton color="inherit" className="text-gray-400">
                            <FolderIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit" className="text-gray-400">
                            <GridViewIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit" className="text-gray-400">
                            <ViewModuleIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit" className="text-gray-400">
                            <CubeIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit" className="text-gray-400">
                            <TuneIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit" className="text-gray-400">
                            <SettingsIcon className="h-6 w-6" />
                        </IconButton>
                        <IconButton color="inherit" className="text-gray-400">
                            <FullscreenIcon className="h-6 w-6" />
                        </IconButton>
                    </div>
                </div>
            </div>

            {/* Bảng điều khiển bên phải */}
            <div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <div className="bg-gray-800 text-blue-400 rounded-lg p-4 text-sm">
                        <p>Xem thêm các sản phẩm decor của Mộc Nghệ, và trải nghiệm nhiều hơn thế nữa!</p>
                        <Button
                            variant="contained"
                            className="mt-2 bg-blue-500 hover:bg-blue-600"
                            startIcon={<RocketLaunchIcon className="h-5 w-5" />}
                        >
                            Mua Hàng
                        </Button>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                        <div className="relative">
                            <Input
                                placeholder="Tìm kiếm thế hệ của tôi"
                                variant="outlined"
                                size="small"
                                className="bg-gray-800 rounded-lg w-48"
                                InputProps={{
                                    startAdornment: (
                                        <IconButton size="small" className="text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </IconButton>
                                    ),
                                }}
                            />
                        </div>
                        <Button className="text-blue-400">Tài sản cũ</Button>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-200">Thiết kế phòng ngủ hiện đại</h3>
                        <div className="text-gray-400">Tất cả 2 tài sản ▶</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer w-full h-32 object-cover">
                            <Image src="/assets/room2.jpg" alt="Mô hình 3D" width={800} height={800} />
                        </div>
                        <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
                            <Image src="/assets/room2.jpg" alt="Mô hình 3D" width={800} height={800} />
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                            <IconButton size="small" className="text-gray-400">
                                <ArrowBackIosNewIcon className="h-4 w-4" />
                            </IconButton>
                            <span>1/1</span>
                            <IconButton size="small" className="text-gray-400">
                                <ArrowForwardIosIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}