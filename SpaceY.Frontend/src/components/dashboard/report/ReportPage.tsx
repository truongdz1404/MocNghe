'use client'
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Spinner,
} from "@/components/ui/MaterialTailwind";
import { format } from 'date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    TooltipItem,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

import { OrderReport } from '@/types/report';
import ReportServices from '@/services/ReportServices';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Type definitions
interface DailyStats {
    day: number;
    orderCount: number;
    revenue: number;
};
interface MonthlyStats {
    month: number;
    orderCount: number;
    revenue: number;
    averageOrderValue: number;
}

interface TopProducts {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

interface ExtendedOrderReport extends OrderReport {
    monthlyStats?: MonthlyStats[];
    dailyStats?: DailyStats[];
    topProducts: TopProducts[];  // Remove the ?
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

const ReportPage = () => {
    const [yearlyReport, setYearlyReport] = useState<ExtendedOrderReport | null>(null);
    const [monthlyReport, setMonthlyReport] = useState<ExtendedOrderReport | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchYearlyReport();
        fetchMonthlyReport();
    }, [selectedYear, selectedMonth]);

    const fetchYearlyReport = async () => {
        try {
            setLoading(true);
            const data = await ReportServices.getOrdersByYear(selectedYear);
            setYearlyReport(data);
        } catch (error) {
            console.error('Error fetching yearly report:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlyReport = async () => {
        try {
            setLoading(true);
            const data = await ReportServices.getOrdersByMonth(selectedYear, selectedMonth);
            setMonthlyReport(data);
        } catch (error) {
            console.error('Error fetching monthly report:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Chart options with proper typing
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 500,
                    }
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                intersect: false,
                mode: 'index' as const,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    callback: function (value: string | number) {
                        return Number(value).toLocaleString() + 'đ';
                    },
                    color: '#64748b',
                    font: {
                        size: 11,
                    }
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11,
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    callback: function (value: string | number, index: number) {
                        return format(new Date(2024, index), 'MMM');
                    },
                    color: '#64748b',
                    font: {
                        size: 11,
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    padding: 20,
                    font: {
                        size: 12,
                        weight: 500,
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    callback: function (value: string | number) {
                        return Number(value).toLocaleString() + 'đ';
                    },
                    color: '#64748b',
                    font: {
                        size: 11,
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11,
                    }
                }
            }
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    generateLabels: function (chart: ChartJS) {
                        const data = chart.data;
                        if (data.labels && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const dataset = data.datasets[0];
                                const value = Array.isArray(dataset.data) ? dataset.data[i] : 0;
                                return {
                                    text: `${label}: ${formatCurrency(Number(value))}`,
                                    fillStyle: Array.isArray(dataset.backgroundColor) ?
                                        dataset.backgroundColor[i] : dataset.backgroundColor,
                                    hidden: false,
                                    index: i,
                                    pointStyle: 'circle' as const,
                                };
                            });
                        }
                        return [];
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function (context: TooltipItem<'pie'>) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${formatCurrency(value)}`;
                    }
                }
            }
        },
    };

    // Prepare chart data with proper typing
    const yearlyChartData = {
        labels: yearlyReport?.monthlyStats?.map((item: MonthlyStats) =>
            format(new Date(2024, item.month - 1), 'MMM')
        ) || [],
        datasets: [
            {
                label: 'Doanh thu',
                data: yearlyReport?.monthlyStats?.map((item: MonthlyStats) => item.revenue) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: 'Số đơn hàng',
                data: yearlyReport?.monthlyStats?.map((item: MonthlyStats) => item.orderCount) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                yAxisID: 'y1',
            },
        ],
    };

    const dailyChartData = {
        labels: monthlyReport?.dailyStats?.map((item: DailyStats) => `Ngày ${item.day}`) || [],
        datasets: [
            {
                label: 'Doanh thu',
                data: monthlyReport?.dailyStats?.map((item: DailyStats) => item.revenue) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: 'Số đơn hàng',
                data: monthlyReport?.dailyStats?.map((item: DailyStats) => item.orderCount) || [],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const topProductsData = {
        labels: monthlyReport?.topProducts?.map((item: TopProducts) => item.productName) || [],
        datasets: [
            {
                data: monthlyReport?.topProducts?.map((item: TopProducts) => item.totalRevenue) || [],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(59, 130, 246)',
                    'rgb(245, 158, 11)',
                    'rgb(16, 185, 129)',
                    'rgb(139, 92, 246)',
                    'rgb(249, 115, 22)',
                ],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    return (
        <div className="h-[calc(100vh-32px)] overflow-y-auto bg-white p-4">
            <div className="container mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
                    <div>
                        <Typography variant="h2" color="blue-gray" className="font-bold text-3xl lg:text-4xl mb-2">
                            📊 Báo cáo bán hàng
                        </Typography>
                        <Typography variant="paragraph" color="blue-gray" className="text-lg opacity-70">
                            Theo dõi và phân tích hiệu suất kinh doanh
                        </Typography>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="appearance-none px-6 py-3 pr-10 border-0 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-xl text-blue-gray-700 font-medium text-base min-w-[120px] cursor-pointer transition-all duration-200 hover:shadow-xl"
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                <svg className="w-4 h-4 text-blue-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                className="appearance-none px-6 py-3 pr-10 border-0 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:shadow-xl text-blue-gray-700 font-medium text-base min-w-[140px] cursor-pointer transition-all duration-200 hover:shadow-xl"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {format(new Date(2024, month - 1), 'MMMM')}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                <svg className="w-4 h-4 text-blue-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                            <Spinner className="h-16 w-16 text-blue-500 mb-4" />
                            <Typography variant="h6" color="blue-gray" className="opacity-70">
                                Đang tải dữ liệu...
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 opacity-10">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <CardHeader floated={false} shadow={false} className="pb-2 bg-transparent">
                                    <Typography variant="h6" className=" opacity-90 text-white font-bold">
                                        📋 Tổng đơn hàng
                                    </Typography>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <Typography variant="h2" className="font-bold text-3xl">
                                        {monthlyReport?.totalOrders?.toLocaleString() || 0}
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 opacity-10">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <CardHeader floated={false} shadow={false} className="pb-2 bg-transparent">
                                    <Typography variant="h6" className=" opacity-90  text-white font-bold">
                                        💰 Tổng doanh thu
                                    </Typography>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <Typography variant="h2" className="font-bold text-2xl lg:text-3xl">
                                        {formatCurrency(monthlyReport?.totalRevenue || 0)}
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute top-0 right-0 opacity-10">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <CardHeader floated={false} shadow={false} className="pb-2 bg-transparent">
                                        <Typography variant="h6" className=" text-white font-boldopacity-90">
                                        📊 Giá trị đơn hàng TB
                                    </Typography>
                                </CardHeader>
                                <CardBody className="pt-0">
                                    <Typography variant="h2" className="font-bold text-2xl lg:text-3xl">
                                        {formatCurrency(monthlyReport?.averageOrderValue || 0)}
                                    </Typography>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Yearly Revenue Trend */}
                            <Card className="xl:col-span-2 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardHeader floated={false} shadow={false} className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                                            📈 Xu hướng doanh thu năm {selectedYear}
                                        </Typography>
                                    </div>
                                </CardHeader>
                                <CardBody className="pt-4">
                                    <div className="h-96">
                                        <Line options={lineChartOptions} data={yearlyChartData} />
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Daily Sales for Selected Month */}
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardHeader floated={false} shadow={false} className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                                            📅 Doanh số hàng ngày
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="opacity-70 mt-1">
                                        {format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}
                                    </Typography>
                                </CardHeader>
                                <CardBody className="pt-4">
                                    <div className="h-80">
                                        <Bar options={barChartOptions} data={dailyChartData} />
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Top Products */}
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardHeader floated={false} shadow={false} className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <Typography variant="h5" color="blue-gray" className="font-semibold">
                                            🏆 Sản phẩm bán chạy
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="opacity-70 mt-1">
                                        Top sản phẩm theo doanh thu
                                    </Typography>
                                </CardHeader>
                                <CardBody className="pt-4">
                                    <div className="h-80">
                                        <Pie options={pieChartOptions} data={topProductsData} />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPage;