import { ProductDto } from '@/types/product';
import { Button, Card, CardBody, CardFooter, Chip, Typography } from '@material-tailwind/react';
import { ShoppingCartIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
interface PageProps {
     products: ProductDto[] 
}
export default function ProductList({ products }: PageProps) {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getPrimaryImage = (product: ProductDto): string => {
        const primaryImage = product.images[0];
        return primaryImage?.url || product.images[0]?.url || '/assets/default-product.jpg';
    };

    const getDiscountPercentage = (product: ProductDto): number | null => {
        const variant = product.variants[0];
        if (variant?.originalPrice && variant.originalPrice > variant.price) {
            return Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100);
        }
        return null;
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <StarIcon
                key={index}
                className={`h-4 w-4 ${index < Math.floor(rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                    }`}
            />
        ));
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
                const discount = getDiscountPercentage(product);
                const primaryImage = getPrimaryImage(product);

                return (
                    <Card key={product.id} className="relative group hover:shadow-xl transition-shadow duration-300">
                        {/* Discount Badge */}
                        {discount && (
                            <Chip
                                value={`-${discount}%`}
                                color="red"
                                className="absolute top-3 left-3 z-10"
                            />
                        )}

                        {/* Featured Badge */}
                        {product.featured && (
                            <Chip
                                value="Nổi bật"
                                color="amber"
                                className="absolute top-3 right-3 z-10"
                            />
                        )}

                        {/* Stock Status */}
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 rounded-lg">
                                <Chip value="Hết hàng" color="gray" className="text-white" />
                            </div>
                        )}

                        <Link href={`/product/${product.id}`}>
                            <div className="relative overflow-hidden rounded-t-lg">
                                <Image
                                    src={primaryImage}
                                    alt={product.title}
                                    width={500}
                                    height={500}
                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </Link>

                        <CardBody className="p-4">
                            {/* Categories */}
                            <div className="flex flex-wrap gap-1 mb-2">
                                {product.categories.slice(0, 2).map((category) => (
                                    <Link href={`/collections/category/${category.id}`} key={category.id}>
                                        <Chip
                                            value={category.name}
                                            size="sm"
                                            color="blue-gray"
                                            variant="ghost"
                                            className="border bg-blue-100"
                                        /></Link>
                                ))}
                            </div>

                            {/* Product Title */}
                            <div className='flex justify-between'>
                                <Link href={`/product/${product.id}`}>
                                    <Typography
                                        variant="h6"
                                        color="black"
                                        className="mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors"
                                    >
                                        {product.title}
                                    </Typography>
                                </Link>

                                <div className="mb-3">
                                    {product.minPrice === product.maxPrice ? (
                                        <Typography variant="h6" color="red">
                                            {formatPrice(product.minPrice)}
                                        </Typography>
                                    ) : (
                                        <Typography variant="h6" color="red">
                                            {product.priceRange}
                                        </Typography>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            {product.reviewCount > 0 && (
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {renderStars(product.averageRating)}
                                    </div>
                                    <Typography variant="small" color="gray">
                                        ({product.reviewCount})
                                    </Typography>
                                </div>
                            )}

                            {product.availableColors.length > 0 && (
                                <div className="flex gap-1 mb-3">
                                    {product.availableColors.slice(0, 4).map((color) => (
                                        <div
                                            key={color.id}
                                            className="w-6 h-6 rounded-md border-2 border-gray-300 cursor-pointer hover:border-gray-500"
                                            style={{ backgroundColor: color.hexCode }}
                                            title={color.name}
                                        />
                                    ))}
                                    {product.availableColors.length > 4 && (
                                        <Typography variant="small" color="gray" className="self-center ml-1">
                                            +{product.availableColors.length - 4}
                                        </Typography>
                                    )}
                                </div>
                            )}
                        </CardBody>

                        <CardFooter className="pt-0 px-4 pb-4">
                            <Button
                                size="lg"
                                fullWidth
                                className="flex items-center justify-center gap-2"
                                color={product.inStock ? "" : "gray"}
                                disabled={!product.inStock}
                                onClick={() => {
                                    console.log('Add to cart:', product.id);
                                }}
                            >
                                <ShoppingCartIcon className="h-8 w-5" />
                                {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    )
}
