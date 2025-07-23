'use client'
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@/components/ui/MaterialTailwind";
import { useEffect, useState } from "react";
import OrderServices from "@/services/OrderServices";
import { format } from "date-fns";
import { OrderDto, OrderStatus } from "@/types/order";
import OrderDetailModal from "@/components/order/OrderDetail";
// import OrderDetailModal from "./OrderDetailModal";

const TABS = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chờ xử lý",
    value: OrderStatus.Pending,
  },
  {
    label: "Hoàn thành",
    value: OrderStatus.Completed,
  },
  {
    label: "Đã hủy",
    value: OrderStatus.Cancelled,
  },
];

const TABLE_HEAD = ["#", "Mã đơn hàng", "Ngày đặt", "Số sản phẩm", "Tổng tiền", "Trạng thái", "Thao tác"];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return "blue";
    case OrderStatus.Completed:
      return "green";
    case OrderStatus.Cancelled:
      return "red";
    default:
      return "gray";
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Completed:
      return "Hoàn thành";
    case OrderStatus.Cancelled:
      return "Đã hủy";
    default:
      return status;
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDto[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  const pageSize = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeTab, searchQuery, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderServices.GetOrdersByUser();
      setOrders(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error('Lỗi khi tải danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchQuery) ||
        order.orderItems.some(item =>
          item.product?.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const handleViewDetails = (order: OrderDto) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4">
            <Typography variant="h5" color="blue-gray">
              Lịch sử đơn hàng
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý các đơn hàng của bạn
            </Typography>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value={activeTab} className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Tìm kiếm đơn hàng..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    <Typography>Đang tải...</Typography>
                  </td>
                </tr>
              ) : getCurrentPageOrders().length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    <Typography>Không tìm thấy đơn hàng nào</Typography>
                  </td>
                </tr>
              ) : (
                getCurrentPageOrders().map((order, index) => {
                  const isLast = index === getCurrentPageOrders().length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={order.id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1 + (currentPage - 1) * pageSize}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          #{order.id}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {format(new Date(order.createdAt), "dd/MM/yyyy")}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {order.orderItems.length} sản phẩm
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {order.totalPrice.toLocaleString('vi-VN')}₫
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={getStatusText(order.status)}
                            color={getStatusColor(order.status)}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Xem chi tiết">
                          <IconButton
                            variant="text"
                            onClick={() => handleViewDetails(order)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Trang {currentPage} / {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Order Details Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </>
  );
}