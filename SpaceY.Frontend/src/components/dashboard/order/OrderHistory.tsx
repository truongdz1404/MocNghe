'use client'
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@/components/ui/MaterialTailwind";
import { useEffect, useState } from "react";
import OrderServices from "@/services/OrderServices";
import { format } from "date-fns";
import { OrderDto, OrderStatus } from "@/types/order";
import OrderDetailDashboard from "@/components/dashboard/order/OrderDetail";
import clsx from "clsx";

// Type definitions
interface UpdateOrderDto {
  status: OrderStatus;
}

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
    value: OrderStatus.Canceled,
  },
  {
    label: "Đã giao",
    value: OrderStatus.Shipped,
  },
];

const TABLE_HEAD = ["#", "Mã đơn hàng", "Ngày đặt", "Số sản phẩm", "Tổng tiền", "Trạng thái", "Thao tác"];

const STATUS_OPTIONS = [
  { value: OrderStatus.Pending, label: "Chờ xử lý", color: "blue" },
  { value: OrderStatus.Completed, label: "Hoàn thành", color: "green" },
  { value: OrderStatus.Canceled, label: "Đã hủy", color: "red" },
  { value: OrderStatus.Shipped, label: "Đã giao", color: "yellow" },
];

const getStatusColor = (status: OrderStatus): "blue" | "green" | "red" | "gray" | "yellow" => {
  switch (status) {
    case OrderStatus.Pending:
      return "blue";
    case OrderStatus.Completed:
      return "green";
    case OrderStatus.Canceled:
      return "red";
    case OrderStatus.Shipped:
      return "yellow";
    default:
      return "gray";
  }
};

const getStatusIcon = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending:
      return "⏳";
    case OrderStatus.Completed:
      return "✅";
    case OrderStatus.Canceled:
      return "❌";
    default:
      return "📋";
  }
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Completed:
      return "Hoàn thành";
    case OrderStatus.Canceled:
      return "Đã hủy";
    case OrderStatus.Shipped:
      return "Đã giao";
    default:
      return status;
  }
};

export default function OrderHistoryDashboard() {
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

  // Status update states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<OrderDto | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusChange = (order: OrderDto, status: string) => {
    if (status !== order.status) {
      setOrderToUpdate(order);
      setNewStatus(status as OrderStatus);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmStatusUpdate = async () => {
    if (!orderToUpdate || !newStatus) return;

    try {
      setIsUpdating(true);
      const updateOrderDto: UpdateOrderDto = { status: newStatus };

      const updatedOrder = await OrderServices.UpdateOrderStatus(orderToUpdate.id, updateOrderDto);

      if (updatedOrder) {
        // Update the orders list
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderToUpdate.id ? { ...order, status: newStatus } : order
          )
        );

        // Show success message (you can implement toast notification here)
        console.log('Cập nhật trạng thái đơn hàng thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      // Show error message (you can implement toast notification here)
    } finally {
      setIsUpdating(false);
      setIsConfirmModalOpen(false);
      setOrderToUpdate(null);
      setNewStatus(null);
    }
  };

  const handleCancelStatusUpdate = () => {
    setIsConfirmModalOpen(false);
    setOrderToUpdate(null);
    setNewStatus(null);
  };

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
        <CardHeader floated={false} shadow={false} className="rounded-none relative z-50">
          <div className="mb-4">
            <Typography variant="h5" color="blue-gray">
              Lịch sử đơn hàng
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Xem và quản lý các đơn hàng của bạn
            </Typography>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-7">
            <Tabs value={activeTab} className="w-full md:min-w-96">
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
                          <Select
                            value={order.status}
                            onChange={(value) => handleStatusChange(order, value || order.status)}
                            size="md"
                            className={clsx(
                              "border border-blue-gray-200 rounded-lg",
                              `bg-${getStatusColor(order.status)}-100`
                            )}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <Option key={option.value} value={option.value}>
                                <div className="flex items-center space-x-2">
                                  <span>{getStatusIcon(option.value)}</span>
                                  <span className="font-medium">{option.label}</span>
                                </div>
                              </Option>
                            ))}
                          </Select>
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
      <OrderDetailDashboard
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />

      {/* Status Update Confirmation Modal */}
      <Dialog
        open={isConfirmModalOpen}
        handler={handleCancelStatusUpdate}
        size="sm"
        className="bg-white shadow-2xl"
      >
        <DialogHeader className="flex items-center space-x-3 pb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Xác nhận thay đổi
            </Typography>
            <Typography variant="small" color="gray" className="font-normal mt-1">
              Bạn có chắc chắn muốn thay đổi trạng thái?
            </Typography>
          </div>
        </DialogHeader>

        <DialogBody className="pt-0 pb-4">
          {orderToUpdate && newStatus && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Mã đơn hàng:
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  #{orderToUpdate.id}
                </Typography>
              </div>

              <div className="flex items-center justify-between">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Trạng thái hiện tại:
                </Typography>
                <Chip
                  variant="ghost"
                  size="sm"
                  value={getStatusText(orderToUpdate.status)}
                  color={getStatusColor(orderToUpdate.status)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Trạng thái mới:
                </Typography>
                <Chip
                  variant="ghost"
                  size="sm"
                  value={getStatusText(newStatus)}
                  color={getStatusColor(newStatus)}
                />
              </div>
            </div>
          )}

          <Typography variant="small" color="gray" className="mt-4 text-center">
            Thao tác này sẽ cập nhật trạng thái đơn hàng và không thể hoàn tác.
          </Typography>
        </DialogBody>

        <DialogFooter className="space-x-4 pt-4">
          <Button
            variant="outlined"
            color="gray"
            onClick={handleCancelStatusUpdate}
            className="hover:shadow-md transition-all duration-200"
            disabled={isUpdating}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleConfirmStatusUpdate}
            className="hover:shadow-lg transition-all duration-200"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang cập nhật...</span>
              </div>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}