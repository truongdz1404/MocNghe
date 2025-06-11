'use client'
import React from "react";
import {
    Step,
    Card,
    Button,
    Stepper,
    CardBody,
    CardHeader,
    Typography,
    IconButton,
} from "@/components/ui/MaterialTailwind";
import { PencilIcon } from "@heroicons/react/24/solid";
// import ImageLoHoa from "/assets/lohoa1.png"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function OrderSection1() {
    const [activeStep, setActiveStep] = React.useState(0);

    const PRODUCTS = [
        {
            img: "/assets/lohoa1.png",
            title: "Lọ hoa gỗ",
            details: "Gỗ tự nhiên, thủ công tinh xảo",
            size: "Kích thước: M",
            price: "Giá: 790.000đ",
        },
        {
            img: "/assets/lohoa1.png",
            title: "Lọ hoa gỗ cổ điển",
            details: "Gỗ cao cấp, chạm khắc tinh tế",
            size: "Kích thước: M",
            price: "Giá: 990.000đ",
        },
    ];

    const BILLING = [
        {
            value: "Tạm tính",
            price: "1.780.000đ",
        },
        {
            value: "Phí vận chuyển",
            price: "0đ",
        },
        {
            value: "Thuế",
            price: "5.000đ",
        },
    ];


    return (
        <section className="container mx-auto py-20 px-8">
            <Typography variant="h4" >Chi tiết đơn hàng</Typography>
            <Typography className="text-gray-600 font-normal">
                Đơn hàng đã đặt vào <span className="font-bold"> 1 Tháng 4, 2025</span>
            </Typography>
            <div className="mt-8 grid lg:gap-x-6 gap-y-6 lg:grid-cols-12 grid-cols-6">
                <div className="col-span-8 space-y-6">
                    <Card className="border border-gray-300 !rounded-md shadow-sm">
                        <CardBody className="p-4 flex gap-4 flex-col md:flex-row items-center justify-between">
                            <div className="flex !justify-between w-full">
                                <div>
                                    <Typography color="blue-gray" className="!font-semibold">
                                        Ngày đặt hàng
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                        1 Tháng 4, 2025
                                    </Typography>
                                </div>
                                <div>
                                    <Typography color="blue-gray" className="!font-semibold">
                                        Số điện thoại
                                    </Typography>
                                    <Typography className="text-gray-600 font-normal">
                                        #0123456789
                                    </Typography>
                                </div>
                            </div>
                            <div className="w-full">
                                <Button
                                    variant="outlined"
                                    className="ml-auto border-gray-200 flex items-center justify-center gap-2 w-full md:max-w-fit"
                                >
                                    Tải xuống hóa đơn
                                    <ArrowDownTrayIcon
                                        strokeWidth={2}
                                        className="h-4 w-4"
                                    />
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="border border-gray-300 !rounded-md shadow-sm">
                        <CardHeader
                            shadow={false}
                            className="md:h-40 h-32 rounded-none border-b border-gray-300"
                        >
                            <Stepper
                                activeStep={activeStep}
                                lineClassName="bg-gray-300"
                                activeLineClassName="bg-gray-900"
                            >
                                <Step
                                    className="fas fa-check-circle !rounded-md !bg-gray-900 !text-white"
                                    activeClassName="bg-blue-gray-500 text-white"
                                    completedClassName="!blue-900 text-white"
                                    onClick={() => setActiveStep(0)}
                                >
                                    <div className="absolute md:pl-32 pl-6 md:-bottom-[4.5rem] -bottom-[3rem] w-max text-left">
                                        <Typography variant="h6" color="blue-gray">
                                            Tài khoản
                                        </Typography>
                                        <Typography className="font-normal text-gray-600 md:block hidden">
                                            10:00 PM  1 Tháng 4, 2025
                                        </Typography>
                                    </div>
                                </Step>
                                <Step
                                    className="fas fa-truck !rounded-md !border border-gray-300 text-gray-900 !bg-white"
                                    activeClassName="!bg-gray-900 !text-white"
                                    completedClassName="!bg-gray-900 !text-white"
                                    onClick={() => setActiveStep(1)}
                                >
                                    <div className="absolute  md:-bottom-[4.5rem] -bottom-[3rem] w-max text-center">
                                        <Typography variant="h6" color="blue-gray">
                                            Đã giao cho chuyển phát
                                        </Typography>
                                        <Typography className="font-normal text-gray-600 md:block hidden">
                                            10:00 PM 3 Tháng 4, 2025
                                        </Typography>
                                    </div>
                                </Step>
                                <Step
                                    className="fas fa-gift !rounded-md !border border-gray-300 text-gray-900 !bg-white"
                                    activeClassName="!bg-gray-900 text-white"
                                    completedClassName="!bg-gray-900 text-white"
                                    onClick={() => setActiveStep(2)}
                                >
                                    <div className="absolute md:-bottom-[4.5rem] -bottom-[3rem] w-max text-right md:pr-44 pr-5">
                                        <Typography variant="h6" color="blue-gray">
                                            Delivery
                                        </Typography>
                                        <Typography className="font-normal text-gray-600 md:block hidden">
                                            Estimated date: April 9, 2024
                                        </Typography>
                                    </div>
                                </Step>
                            </Stepper>
                        </CardHeader>
                        <CardBody className="md:px-2 pb-14">
                            {PRODUCTS.map(({ img, title, details, size, price }) => (
                                <div
                                    key={title}
                                    className="space-y-10 flex flex-wrap justify-center md:justify-start items-start"
                                >
                                    <Image src={img} className="h-[140px] mr-3" alt={title} width={140} height={140} />
                                    <div className="-translate-y-6 space-y-1 md:text-start text-center">
                                        <Typography variant="h6" color="blue-gray">
                                            {title}
                                        </Typography>
                                        <Typography className="font-normal text-gray-600">
                                            {details}
                                        </Typography>
                                        <Typography className="font-normal text-gray-600">
                                            {size}
                                        </Typography>
                                        <Typography className="font-normal text-gray-600">
                                            {price}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
                <div className="lg:col-span-4 col-span-full space-y-6">
                    <Card className="border border-gray-300 !rounded-md shadow-sm">
                        <CardBody className="p-4">
                            <Typography color="blue-gray" className="!font-semibold">
                                Thời gian đặt hàng
                            </Typography>
                            {BILLING.map(({ value, price }) => (
                                <div key={value} className="my-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Typography className="text-gray-600 font-normal">
                                            {value}
                                        </Typography>
                                        <Typography className="text-gray-600 font-normal">
                                            {price}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between border-t border-gray-300 pt-4">
                                <Typography color="blue-gray" className="!font-semibold">
                                    Tổng tiền
                                </Typography>
                                <Typography color="blue-gray" className="!font-semibold">
                                    1.785.000đ
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="border border-gray-300 !rounded-md shadow-sm">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <Typography color="blue-gray" className="!font-semibold">
                                    Địa chỉ giao hàng
                                </Typography>
                                <IconButton
                                    size="sm"
                                    variant="outlined"
                                    className="border-gray-300 !rounded-md"
                                >
                                    <PencilIcon className="h-3.5 w-3.5 text-gray-900" />
                                </IconButton>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Typography className="text-gray-600 font-normal">
                                    John Doe
                                </Typography>
                                <Typography className="text-gray-600 font-normal">
                                    1234 Elm Street
                                </Typography>
                                <Typography className="text-gray-600 font-normal">
                                    Suite 567
                                </Typography>
                                <Typography className="text-gray-600 font-normal">
                                    Los Angeles, CA 90001
                                </Typography>
                                <Typography className="text-gray-600 font-normal">
                                    United States
                                </Typography>
                                <Typography className="text-gray-600 font-normal">
                                    +1 (555) 123-4567
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="border border-gray-300 !rounded-md shadow-sm">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <Typography color="blue-gray" className="!font-semibold">
                                    Thanh toán
                                </Typography>
                                <IconButton
                                    size="sm"
                                    variant="outlined"
                                    className="border-gray-300 !rounded-md"
                                >
                                    <PencilIcon className="h-3.5 w-3.5 text-gray-900" />
                                </IconButton>
                            </div>
                            <Typography className="mt-4 text-gray-600 font-normal">
                                Thanh toán khi nhận hàng
                            </Typography>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default OrderSection1;