
'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {
    Typography,
    Button,
    Spinner,
    Alert,
    IconButton
} from "@material-tailwind/react"


import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react"
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon
} from "@heroicons/react/24/solid"
import { ProductDto, ProductSearchParams, PaginatedData } from '@/types/product'
import ProductServices from '@/services/ProductServices'
import { CategoryDto } from '@/types/category'
import { useRouter } from 'next/navigation'
import CategoryServices from '@/services/CategoryServices'
import { ChevronDown } from 'lucide-react'
import ProductList from '@/components/product/ProductList'

interface ProductListProps {
    categoryId?: number;
    pageSize?: number;
    searchTerm?: string;
    onPageChange?: (page: number) => void;
}

export default function AllProduct({
    categoryId,
    pageSize = 12,
    searchTerm,
    onPageChange
}: ProductListProps) {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationData, setPaginationData] = useState<PaginatedData<ProductDto> | null>(null);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Fetch categories khi component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const result = await CategoryServices.GetPaginated({
                pageSize: 50, // Lấy nhiều hơn để hiển thị đầy đủ
                includeDeleted: false
            });
            const visibleCategories = result.data.filter(cat => cat.visible);
            setCategories(visibleCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (categoryId: number) => {
        router.push(`/collections/category/${categoryId}`);
    };
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const params: ProductSearchParams = {
                    pageNumber: currentPage,
                    pageSize,
                    includeDeleted: false,
                    includeDetails: true,
                };

                if (categoryId !== undefined && categoryId !== null) {
                    params.categoryId = categoryId;
                }

                if (searchTerm) {
                    params.searchTerm = searchTerm;
                }

                const response = await ProductServices.GetPaginated(params);

                // Store pagination data
                setPaginationData(response);

                // Filter visible products
                const visibleProducts = response.data.filter(product => product.visible && !product.deleted);
                setProducts(visibleProducts);
            } catch (err) {
                setError('Không thể tải danh sách sản phẩm');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, pageSize, currentPage, searchTerm]);

    // Reset to page 1 when search term or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        onPageChange?.(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const renderPagination = () => {
        if (!paginationData || paginationData.totalCount <= pageSize) return null;

        const totalPages = Math.ceil(paginationData.totalCount / pageSize);
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
                {/* First Page Button */}
                <IconButton
                    variant="text"
                    className="rounded-full"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronDoubleLeftIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>

                {/* Previous Page Button */}
                <IconButton
                    variant="text"
                    className="rounded-full"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>

                {/* Page Numbers */}
                {pages.map((pageNum) => (
                    <IconButton
                        key={pageNum}
                        variant={pageNum === currentPage ? "filled" : "text"}
                        color={pageNum === currentPage ? "black" : "blue-gray"}
                        onClick={() => handlePageChange(pageNum)}
                        className="rounded-full"
                    >
                        {pageNum}
                    </IconButton>
                ))}

                {/* Next Page Button */}
                <IconButton
                    variant="text"
                    className="rounded-full"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>

                {/* Last Page Button */}
                <IconButton
                    variant="text"
                    className="rounded-full"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronDoubleRightIcon strokeWidth={2} className="h-4 w-4" />
                </IconButton>
            </div>
        );
    };

    const renderPaginationInfo = () => {
        if (!paginationData) return null;

        const { totalCount } = paginationData;
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalCount);

        return (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <Typography variant="small" color="gray">
                    Hiển thị {startItem} - {endItem} trong tổng số {totalCount} sản phẩm
                </Typography>

            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner className="h-12 w-12" color="blue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8">
                <Alert color="red" className="mb-4">
                    {error}
                </Alert>
                <div className="text-center">
                    <Button
                        onClick={() => window.location.reload()}
                        color="gray"
                        variant="filled"
                    >
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <Typography variant="h5" color="gray" className="mb-2">
                    Không có sản phẩm nào
                </Typography>
                <Typography color="gray">
                    Hãy thử tìm kiếm với từ khóa khác
                </Typography>
            </div>
        );
    }

    return (
        <div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    {/* Category Dropdown */}
                    <Menu placement="bottom-start">
                        <MenuHandler>
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="flex items-center gap-1 p-2 font-medium text-black normal-case text-base"
                                disabled={loading}
                            >
                                Loại sản phẩm
                                <ChevronDown size={16} />
                            </Button>
                        </MenuHandler>
                        <MenuList className="max-h-80 w-64 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-4">
                                    <Spinner className="h-4 w-4" />
                                    <Typography variant="paragraph" className="ml-2">
                                        Đang tải...
                                    </Typography>
                                </div>
                            ) : categories.length > 0 ? (
                                <>
                                    <MenuItem
                                        onClick={() => router.push('/collections')}
                                        className="border-b border-blue-gray-50"
                                    >
                                            <Link href="/collections/shop-all" passHref>
                                                <Typography variant="paragraph" className="font-medium" as="a">
                                                    Tất cả sản phẩm
                                                </Typography>
                                            </Link>

                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                        >
                                            <Typography variant="paragraph">
                                                {category.name}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </>
                            ) : (
                                <MenuItem disabled>
                                    <Typography variant="paragraph" color="gray">
                                        Không có danh mục nào
                                    </Typography>
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>

                    {/* Color Filter */}
                    <Menu placement="bottom-start">
                        <MenuHandler>
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="flex items-center gap-1 p-2 font-medium text-black normal-case text-base"
                            >
                                Màu
                                <ChevronDown size={16} />
                            </Button>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem>
                                <Typography variant="paragraph">Đỏ</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">Xanh</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">Vàng</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">Trắng</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">Đen</Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    {/* Price Filter */}
                    <Menu placement="bottom-start">
                        <MenuHandler>
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="flex items-center gap-1 p-2 font-medium text-black normal-case text-base"
                            >
                                Giá
                                <ChevronDown size={16} />
                            </Button>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem>
                                <Typography variant="paragraph">Dưới 100.000đ</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">100.000đ - 500.000đ</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">500.000đ - 1.000.000đ</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">Trên 1.000.000đ</Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    {/* Availability Filter */}
                    <Menu placement="bottom-start">
                        <MenuHandler>
                            <Button
                                variant="text"
                                color="blue-gray"
                                className="flex items-center gap-1 p-2 font-medium text-black normal-case text-base"
                            >
                                Khả dụng
                                <ChevronDown size={16} />
                            </Button>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem>
                                <Typography variant="paragraph">Còn hàng</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography variant="paragraph">Hết hàng</Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    <Button
                        variant="text"
                        color="blue-gray"
                        className="p-2 font-medium text-black normal-case text-base underline hover:no-underline"
                    >
                        <Link href="/collections/shop-all"> Xoá bộ lọc</Link>
                    </Button>
                </div>

                {/* Sort Dropdown */}
                <Menu placement="bottom-end">
                    <MenuHandler>
                        <Button
                            variant="text"
                            color="blue-gray"
                            className="flex items-center gap-1 p-2 font-medium text-black normal-case text-base"
                        >
                            Sắp xếp
                            <ChevronDown size={16} />
                        </Button>
                    </MenuHandler>
                    <MenuList>
                        <MenuItem>
                            <Typography variant="paragraph">Mới nhất</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="paragraph">Cũ nhất</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="paragraph">Giá: Thấp đến cao</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="paragraph">Giá: Cao đến thấp</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="paragraph">Tên: A-Z</Typography>
                        </MenuItem>
                        <MenuItem>
                            <Typography variant="paragraph">Tên: Z-A</Typography>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </div>
            {/* Product Grid */}
            <ProductList products={products}></ProductList>

            {/* Pagination Info */}
            {renderPaginationInfo()}

            {/* Pagination Controls */}
            {renderPagination()}
        </div>
    );
}