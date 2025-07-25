"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Tooltip,
    Avatar,
    Select,
    Option,
} from "@/components/ui/MaterialTailwind";
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import UserServices from "@/services/UserServices";
import { User, CreateUser } from "@/types/user";

enum Role {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
}

const USER_TABLE_HEAD = ["#", "Avatar", "Tên", "Email", "Vai trò", "Thao tác"];
const PAGE_SIZE = 10;

export default function ListUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    // const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    // const [updateFormData, setUpdateFormData] = useState<UpdateUser>({ id: "", username: "", email: "", phoneNumber: "", role: "", avatarUrl: "" });
    const [createFormData, setCreateFormData] = useState<CreateUser>({ userName: "", email: "", password: "", phoneNumber: "", avatarUrl: "", role: Role.CUSTOMER });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserServices.getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
            setTotalItems(data.length);
            setTotalPages(Math.ceil(data.length / PAGE_SIZE));
        } catch (error) {
            setUsers([]);
            setFilteredUsers([]);
            console.error('Lỗi khi tải danh sách người dùng:', error);
            alert("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
        setTotalItems(filtered.length);
        setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
        setCurrentPage(1);
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

    const handleViewUser = async (id: string) => {
        try {
            const user = await UserServices.getUserById(id);
            setSelectedUser(user);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết người dùng:', error);
            alert("Không thể tải chi tiết người dùng");
        }
    };

    // const handleUpdateUserOpen = async (user: User) => {
    //     try {
    //         const userData = await UserServices.getUserById(user.id);
    //         setSelectedUser(userData);
    //         setUpdateFormData({
    //             id: userData.id,
    //             username: userData.username || "",
    //             email: userData.email || "",
    //             phoneNumber: userData.phoneNumber || "",
    //             role: userData.role || "",
    //             avatarUrl: userData.avatarUrl || "",
    //         });
    //         setIsUpdateModalOpen(true);
    //     } catch (error) {
    //         console.error('Lỗi khi tải chi tiết người dùng để chỉnh sửa:', error);
    //         alert("Không thể tải chi tiết người dùng");
    //     }
    // };

    // const handleUpdateUser = async () => {
    //     if (!selectedUser || !updateFormData.username!.trim() || !updateFormData.email!.trim()) {
    //         alert("Vui lòng nhập đầy đủ tên và email");
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         await UserServices.updateUser(selectedUser.id, updateFormData);
    //         alert("Cập nhật người dùng thành công!");
    //         setIsUpdateModalOpen(false);
    //         fetchUsers();
    //     } catch (error) {
    //         console.error('Lỗi khi cập nhật người dùng:', error);
    //         alert("Có lỗi xảy ra khi cập nhật người dùng");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleCreateUserOpen = () => {
        setCreateFormData({ userName: "", email: "", password: "", phoneNumber: "", avatarUrl: "", role: Role.CUSTOMER });
        setIsCreateModalOpen(true);
    };

    const handleCreateUser = async () => {
        if (!createFormData.userName.trim() || !createFormData.email.trim() || !createFormData.password.trim()) {
            alert("Vui lòng nhập đầy đủ tên, email và mật khẩu");
            return;
        }
        setLoading(true);
        try {
            await UserServices.createUser(createFormData);
            alert("Tạo người dùng thành công!");
            setIsCreateModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            alert("Có lỗi xảy ra khi tạo người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
        setLoading(true);
        try {
            await UserServices.deleteUser(id);
            alert("Xóa người dùng thành công!");
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            alert("Có lỗi xảy ra khi xóa người dùng");
        } finally {
            setLoading(false);
        }
    };

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="h-[calc(100vh-32px)] flex flex-col">
            <Card className="flex-1 flex flex-col">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Danh sách người dùng
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                Xem và quản lý người dùng ({totalItems} người dùng)
                            </Typography>
                        </div>
                        <Button className="flex items-center gap-3" onClick={handleCreateUserOpen}>
                            <PlusIcon strokeWidth={2} className="h-4 w-4" />
                            Thêm người dùng
                        </Button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="w-full md:w-72">
                            <Input
                                label="Tìm kiếm người dùng..."
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                crossOrigin={undefined}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="flex-1 px-0" style={{ maxHeight: "calc(100vh - 180px)", overflow: "auto" }}>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {USER_TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
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
                                    <td colSpan={USER_TABLE_HEAD.length} className="p-4 text-center">
                                        <Typography>Đang tải...</Typography>
                                    </td>
                                </tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={USER_TABLE_HEAD.length} className="p-4 text-center">
                                        <Typography>Không tìm thấy người dùng nào</Typography>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user, index) => {
                                    const isLast = index === paginatedUsers.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={user.id}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Avatar
                                                    src={user.avatarUrl || "/placeholder-image.jpg"}
                                                    alt={user.username}
                                                    size="sm"
                                                    variant="rounded"
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {user.username}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {user.email}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {user.role || "N/A"}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip content="Xem chi tiết">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue"
                                                            onClick={() => handleViewUser(user.id)}
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {/* <Tooltip content="Chỉnh sửa">
                                                        <IconButton
                                                            variant="text"
                                                            color="green"
                                                            onClick={() => handleUpdateUserOpen(user)}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip> */}
                                                    <Tooltip content="Xóa">
                                                        <IconButton
                                                            variant="text"
                                                            color="red"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
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
                        Trang {currentPage} / {totalPages} - Tổng {totalItems} người dùng
                    </Typography>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={handlePrevious}
                            disabled={currentPage === 1 || loading}
                        >
                            Trước
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentPage === totalPages || loading}
                        >
                            Sau
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* View User Dialog */}
            <Dialog open={isViewModalOpen} handler={() => setIsViewModalOpen(false)} size="sm">
                <DialogHeader>
                    <Typography variant="h4" color="blue-gray">
                        Chi tiết người dùng
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Avatar
                                </Typography>
                                <Avatar
                                    src={selectedUser.avatarUrl || "/placeholder-image.jpg"}
                                    alt={selectedUser.username}
                                    size="lg"
                                    variant="rounded"
                                />
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Tên
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedUser.username}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Email
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedUser.email}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Vai trò
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedUser.role || "N/A"}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Số điện thoại
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedUser.phoneNumber || "N/A"}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Địa chỉ
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedUser.address && selectedUser.address.length > 0
                                        ? selectedUser.address.map(addr => `${addr.street}, ${addr.city}`).join("; ")
                                        : "N/A"}
                                </Typography>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsViewModalOpen(false)}
                        className="mr-1"
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Create User Dialog */}
            <Dialog open={isCreateModalOpen} handler={() => setIsCreateModalOpen(false)} size="sm">
                <DialogHeader>
                    <Typography variant="h4" color="blue-gray">
                        Thêm người dùng
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="Tên *"
                            value={createFormData.userName}
                            onChange={(e) => setCreateFormData({ ...createFormData, userName: e.target.value })}
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            label="Email *"
                            value={createFormData.email}
                            onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            label="Mật khẩu *"
                            type="password"
                            value={createFormData.password}
                            onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            label="Số điện thoại"
                            value={createFormData.phoneNumber}
                            onChange={(e) => setCreateFormData({ ...createFormData, phoneNumber: e.target.value })}
                            crossOrigin={undefined}
                        />
                        <Input
                            label="URL Avatar"
                            value={createFormData.avatarUrl}
                            onChange={(e) => setCreateFormData({ ...createFormData, avatarUrl: e.target.value })}
                            crossOrigin={undefined}
                        />
                        <Select
                            label="Vai trò"
                            value={createFormData.role}
                            onChange={(value) => setCreateFormData({ ...createFormData, role: value as Role })}
                        >
                            <Option value={Role.CUSTOMER}>Khách hàng</Option>
                            <Option value={Role.ADMIN}>Quản trị viên</Option>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="mr-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        color="blue"
                        onClick={handleCreateUser}
                        disabled={loading}
                    >
                        {loading ? "Đang tạo..." : "Tạo"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Update User Dialog */}
            {/* <Dialog open={isUpdateModalOpen} handler={() => setIsUpdateModalOpen(false)} size="sm">
                <DialogHeader>
                    <Typography variant="h4" color="blue-gray">
                        Chỉnh sửa người dùng
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="Tên *"
                            value={updateFormData.username}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, username: e.target.value })}
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            label="Email *"
                            value={updateFormData.email}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, email: e.target.value })}
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            label="Số điện thoại"
                            value={updateFormData.phoneNumber}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, phoneNumber: e.target.value })}
                            crossOrigin={undefined}
                        />
                        <Input
                            label="URL Avatar"
                            value={updateFormData.avatarUrl}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, avatarUrl: e.target.value })}
                            crossOrigin={undefined}
                        />
                        <Select
                            label="Vai trò"
                            value={updateFormData.role}
                            onChange={(value) => setUpdateFormData({ ...updateFormData, role: value as string })}
                        >
                            <Option value={Role.CUSTOMER}>Khách hàng</Option>
                            <Option value={Role.ADMIN}>Quản trị viên</Option>
                        </Select>
                    </div>
                </DialogBody>
            </Dialog> */}
        </div>
    );
}