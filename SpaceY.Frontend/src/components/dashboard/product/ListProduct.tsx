'use client'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Badge,
  Avatar,
} from "@/components/ui/MaterialTailwind";
import { useEffect, useState } from "react";
// import { Select, Option } from "@/components/ui/MaterialTailwind";
import { ProductDto } from "@/types/product";
import ProductServices from "@/services/ProductServices";
import CategoryServices from "@/services/CategoryServices";
import Image from "next/image";
import CreateProductPopup from "@/components/dashboard/product/CreateProductPopup";
import EditProductPopup from "@/components/dashboard/product/EditProductPopup";

// Table header for product attributes
const PRODUCT_TABLE_HEAD = ["#", "Ảnh", "Tên sản phẩm", "Giá", "Số lượng", "Trạng thái", "Đánh giá", "Thao tác"];

const PAGE_SIZE = 10;
export default function ListProduct() {

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductDto | null>(null);
  const handleEditProduct = (product: ProductDto) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditProductClose = () => {
    setIsEditModalOpen(false);
    setEditProduct(null);
  };

  const handleProductUpdated = () => {
    fetchProducts();
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Category filter
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory]);


  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      // Giả sử có CategoryServices.GetAll hoặc API tương tự
      const data = await CategoryServices.GetAll();
      setCategories(data || []);
    } catch (error) {
      setCategories([]);
      console.error('Lỗi khi tải danh sách danh mục:', error);
    }
  };

  // Fetch products with proper pagination & category filter
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
        includeDeleted: false,
        searchTerm: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
      };
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }
      const data = await ProductServices.GetPaginated(params);
      setProducts(data.data);
      setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
      setTotalItems(data.totalCount || data.data.length);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewDetails = (product: ProductDto) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCreateProduct = () => {
    setIsCreateModalOpen(true);
    // Call your existing createProduct function here
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

  const formatPrice = (min: number, max: number) => {
    if (min === max) {
      return `${min.toLocaleString()}₫`;
    }
    return `${min.toLocaleString()}₫ - ${max.toLocaleString()}₫`;
  };

  const getStatusBadge = (product: ProductDto) => {
    if (!product.visible) {
      return <Badge color="red" >Ẩn</Badge>;
    }
    if (!product.inStock) {
      return <Badge color="orange" >Hết hàng</Badge>;
    }
    return <Badge color="green" >Đang bán</Badge>;
  };


  return (
    <div className="h-[calc(100vh-32px)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Typography variant="h5" color="blue-gray">
                Danh sách sản phẩm
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Xem và quản lý các sản phẩm của bạn ({totalItems} sản phẩm)
              </Typography>
            </div>
            <Button
              className="flex items-center gap-3"
              onClick={handleCreateProduct}
            >
              <PlusIcon strokeWidth={2} className="h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="w-full md:w-72">
              <div className="relative">
                <select
                  name="categoryId"
                  value={selectedCategory ? String(selectedCategory) : ""}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full h-11 px-3 py-2.5 text-sm border border-blue-gray-200 rounded-lg bg-transparent focus:border-gray-900 focus:outline-none peer"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
                <label className="absolute left-3 -top-2.5 px-1 text-xs text-blue-gray-500 bg-white peer-focus:text-gray-900 peer-placeholder-shown:text-sm peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:top-2.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-900 transition-all">
                  Lọc theo danh mục
                </label>
              </div>
            </div>
            <div className="w-full md:w-72">
              <Input
                label="Tìm kiếm sản phẩm..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>


            {/* <div className="w-full md:w-72">
              <Select
                label="Lọc theo danh mục"
                value={selectedCategory ? String(selectedCategory) : ""}
                onChange={(val) => setSelectedCategory(val ? Number(val) : null)}
                className="min-w-[180px]"
                menuProps={{ placement: "bottom" }}
              >
                <Option value="">Tất cả danh mục</Option>
                {categories.map((cat) => (
                  <Option key={cat.id} value={String(cat.id)}>{cat.name}</Option>
                ))}
              </Select>
            </div> */}
          </div>
        </CardHeader>

        <CardBody className="flex-1 px-0" style={{ maxHeight: "calc(100vh - 180px)", overflow: "auto" }}>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {PRODUCT_TABLE_HEAD.map((head) => (
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
                  <td colSpan={PRODUCT_TABLE_HEAD.length} className="p-4 text-center">
                    <Typography>Đang tải...</Typography>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={PRODUCT_TABLE_HEAD.length} className="p-4 text-center">
                    <Typography>Không tìm thấy sản phẩm nào</Typography>
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  const isLast = index === products.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={product.id}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {(currentPage - 1) * PAGE_SIZE + index + 1}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Avatar
                          src={product.image2DUrl || product.images?.[0]?.url || "/placeholder-image.jpg"}
                          alt={product.title}
                          size="sm"
                          variant="rounded"
                        />
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {product.title}
                          </Typography>
                          {product.featured && (
                            <Badge color="yellow" className="w-fit mt-1">
                              Nổi bật
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {formatPrice(product.minPrice, product.maxPrice)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {product.totalStock}
                        </Typography>
                      </td>
                      <td className={classes}>
                        {getStatusBadge(product)}
                      </td>
                      <td className={classes}>
                        <div className="flex items-center">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            ⭐ {product.averageRating.toFixed(1)} ({product.reviewCount})
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <Tooltip content="Xem chi tiết">
                            <IconButton
                              variant="text"
                              onClick={() => handleViewDetails(product)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Chỉnh sửa">
                            <IconButton
                              variant="text"
                              onClick={() => handleEditProduct(product)}
                            >
                              <PencilIcon className="h-4 w-4" />
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
            Trang {currentPage} / {totalPages} - Tổng {totalItems} sản phẩm
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
      <Dialog open={isDetailModalOpen} handler={() => setIsDetailModalOpen(false)} size="lg">
        <DialogHeader className="flex flex-col items-start">
          <Typography variant="h4" color="blue-gray">
            Chi tiết sản phẩm
          </Typography>
        </DialogHeader>
        <DialogBody className="max-h-96 overflow-y-auto">
          {selectedProduct && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Image
                    width={500}
                    height={500}
                    src={selectedProduct.image2DUrl || selectedProduct.images?.[0]?.url || "/placeholder-image.jpg"}
                    alt={selectedProduct.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Typography variant="h5">{selectedProduct.title}</Typography>
                  <Typography variant="paragraph" color="gray">
                    {selectedProduct.description}
                  </Typography>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedProduct)}
                    {selectedProduct.featured && (
                      <Badge color="yellow" >Nổi bật</Badge>
                    )}
                  </div>
                  <Typography variant="h6" color="blue-gray">
                    Giá: {formatPrice(selectedProduct.minPrice, selectedProduct.maxPrice)}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Tổng kho: {selectedProduct.totalStock} | Đánh giá: ⭐ {selectedProduct.averageRating.toFixed(1)} ({selectedProduct.reviewCount})
                  </Typography>
                </div>
              </div>

              {/* Product Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <Typography variant="h6" className="mb-3">Biến thể sản phẩm</Typography>
                  <div className="space-y-2">
                    {selectedProduct.variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={variant.image || "/placeholder-image.jpg"}
                            alt={`Variant ${index + 1}`}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography variant="small" color="blue-gray">
                              {variant.color?.name} - {variant.size?.name}
                            </Typography>
                            <Typography variant="small" color="gray">
                              SKU: {variant.sku}
                            </Typography>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {variant.price.toLocaleString()}₫
                          </Typography>
                          <Typography variant="small" color="gray">
                            Kho: {variant.quantity}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Colors */}
              {selectedProduct.availableColors && selectedProduct.availableColors.length > 0 && (
                <div>
                  <Typography variant="h6" className="mb-3">Màu sắc có sẵn</Typography>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.availableColors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color.hexCode }}
                        ></div>
                        <Typography variant="small">{color.name}</Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Sizes */}
              {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
                <div>
                  <Typography variant="h6" className="mb-3">Kích thước có sẵn</Typography>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.availableSizes.map((size, index) => (
                      <Badge key={index} color="blue-gray">
                        {size.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {selectedProduct.categories && selectedProduct.categories.length > 0 && (
                <div>
                  <Typography variant="h6" className="mb-3">Danh mục</Typography>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.categories.map((category, index) => (
                      <Badge key={index} color="green">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Gallery */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div>
                  <Typography variant="h6" className="mb-3">Thư viện ảnh</Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <Image
                        key={index}
                        width={500}
                        height={500}
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsDetailModalOpen(false)}
            className="mr-1"
          >
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create Product Modal */}
      <Dialog open={isCreateModalOpen} handler={() => setIsCreateModalOpen(false)} size="lg">
        <DialogHeader>
          <Typography variant="h4" color="blue-gray">
            Thêm sản phẩm mới
          </Typography>
        </DialogHeader>
        <DialogBody>
          <CreateProductPopup />
        </DialogBody>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} handler={handleEditProductClose} size="lg">
        <DialogHeader>
          <Typography variant="h4" color="blue-gray">
            Chỉnh sửa sản phẩm
          </Typography>
        </DialogHeader>
        <DialogBody>
          {editProduct && (
            <EditProductPopup product={editProduct} onClose={handleEditProductClose} onUpdated={handleProductUpdated} />
          )}
        </DialogBody>
      </Dialog>
    </div>
  );
}