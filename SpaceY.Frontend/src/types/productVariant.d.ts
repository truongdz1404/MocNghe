export interface ProductVariantDto {
    id: number;
    productId: number;
    colorId: number;
    sizeId: number;
    price: number;
    originalPrice: number;
    stock: number;
    sku: string;
    visible: boolean;
}