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
    Badge,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Tooltip,
    Avatar,
} from "@/components/ui/MaterialTailwind";
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import CategoryServices from "@/services/CategoryServices";
import { CategoryDto, UpdateCategoryDto } from "@/types/category";

const CATEGORY_TABLE_HEAD = ["#", "Image","Tên danh mục", "Trạng thái", "Ngày tạo", "Thao tác"];
const PAGE_SIZE = 10;

export default function ListCategory() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
    const [updateFormData, setUpdateFormData] = useState<UpdateCategoryDto>({ name: "", url: "", visible: true });

    useEffect(() => {
        fetchCategories();
    }, [currentPage, searchQuery]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = {
                pageNumber: currentPage,
                pageSize: PAGE_SIZE,
                includeDeleted: false,
            };
            const data = await CategoryServices.GetPaginated(params);
            setCategories(data.data);
            setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
            setTotalItems(data.totalCount || data.data.length);
        } catch (error) {
            setCategories([]);
            console.error('Lỗi khi tải danh sách danh mục:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
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

    const handleViewCategory = async (id: number) => {
        try {
            const category = await CategoryServices.GetById(id);
            setSelectedCategory(category);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error('Lỗi khi tải chi tiết danh mục:', error);
            alert("Không thể tải chi tiết danh mục");
        }
    };


    const handleUpdateCategoryOpen = async (category: CategoryDto) => {
        setSelectedCategory(category);
        setUpdateFormData({
            name: category.name,
            url: category.url,
            visible: category.visible,
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory || !updateFormData.name.trim()) {
            alert("Vui lòng nhập tên danh mục");
            return;
        }
        setLoading(true);
        try {
            await CategoryServices.Update(selectedCategory.id, updateFormData);
            alert("Cập nhật danh mục thành công!");
            setIsUpdateModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            alert("Có lỗi xảy ra khi cập nhật danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
        setLoading(true);
        try {
            await CategoryServices.SoftDelete(id);
            alert("Xóa danh mục thành công!");
            fetchCategories();
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            alert("Có lỗi xảy ra khi xóa danh mục");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (category: CategoryDto) => {
        if (!category.visible) {
            return <Badge color="red">Ẩn</Badge>;
        }
        if (category.deleted) {
            return <Badge color="orange">Đã xóa</Badge>;
        }
        return <Badge color="green">Hiển thị</Badge>;
    };

    return (
        <div className="h-[calc(100vh-32px)] flex flex-col">
            <Card className="flex-1 flex flex-col">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Danh sách danh mục
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                Xem và quản lý các danh mục ({totalItems} danh mục)
                            </Typography>
                        </div>
                        <Button className="flex items-center gap-3">
                            <PlusIcon strokeWidth={2} className="h-4 w-4" />
                            Thêm danh mục
                        </Button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="w-full md:w-72">
                            <Input
                                label="Tìm kiếm danh mục..."
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                crossOrigin={undefined}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="flex-1 px-0" style={{ maxHeight: "calc(100vh - 180px)", overflow: "auto" }}>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {CATEGORY_TABLE_HEAD.map((head) => (
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
                                    <td colSpan={CATEGORY_TABLE_HEAD.length} className="p-4 text-center">
                                        <Typography>Đang tải...</Typography>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={CATEGORY_TABLE_HEAD.length} className="p-4 text-center">
                                        <Typography>Không tìm thấy danh mục nào</Typography>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category, index) => {
                                    const isLast = index === categories.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={category.id}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                                                </Typography>
                                            </td>
                                           
                                            <td className={classes}>
                                                <Avatar
                                                    src={category.url  || "/placeholder-image.jpg"}
                                                    alt={category.name}
                                                    size="sm"
                                                    variant="rounded"
                                                />
                                                
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {category.name}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                {getStatusBadge(category)}
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {new Date(category.createdAt).toLocaleString()}
                                                </Typography>
                                            </td>
                                            {/* <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {new Date(category.modifiedAt).toLocaleString()}
                                                </Typography>
                                            </td> */}
                                            <td className={classes}>
                                                <div className="flex items-center gap-2">
                                                    <Tooltip content="Xem chi tiết">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue"
                                                            onClick={() => handleViewCategory(category.id)}
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Chỉnh sửa">
                                                        <IconButton
                                                            variant="text"
                                                            color="green"
                                                            onClick={() => handleUpdateCategoryOpen(category)}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Xóa">
                                                        <IconButton
                                                            variant="text"
                                                            color="red"
                                                            onClick={() => handleDeleteCategory(category.id)}
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
                        Trang {currentPage} / {totalPages} - Tổng {totalItems} danh mục
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

            {/* View Category Dialog */}
            <Dialog open={isViewModalOpen} handler={() => setIsViewModalOpen(false)} size="sm">
                <DialogHeader>
                    <Typography variant="h4" color="blue-gray">
                        Chi tiết danh mục
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    {selectedCategory && (
                        <div className="space-y-4">
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Tên danh mục
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedCategory.name}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    URL
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {selectedCategory.url}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Trạng thái
                                </Typography>
                                {getStatusBadge(selectedCategory)}
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Ngày tạo
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {new Date(selectedCategory.createdAt).toLocaleString()}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray">
                                    Ngày sửa
                                </Typography>
                                <Typography variant="small" color="gray">
                                    {new Date(selectedCategory.modifiedAt).toLocaleString()}
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

            {/* Update Category Dialog */}
            <Dialog open={isUpdateModalOpen} handler={() => setIsUpdateModalOpen(false)} size="sm">
                <DialogHeader>
                    <Typography variant="h4" color="blue-gray">
                        Chỉnh sửa danh mục
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <div className="space-y-4">
                        <Input
                            label="Tên danh mục *"
                            value={updateFormData.name}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            label="URL"
                            value={updateFormData.url}
                            onChange={(e) => setUpdateFormData({ ...updateFormData, url: e.target.value })}
                            crossOrigin={undefined}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={updateFormData.visible}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, visible: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <Typography variant="small" color="blue-gray">
                                Hiển thị
                            </Typography>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setIsUpdateModalOpen(false)}
                        className="mr-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        color="blue"
                        onClick={handleUpdateCategory}
                        disabled={loading}
                    >
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}