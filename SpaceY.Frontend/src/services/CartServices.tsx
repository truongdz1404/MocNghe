import api from "@/services/api";

// Types based on your C# DTOs
export interface AddToCartRequest {
    productVariantId: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    productVariantId: number;
    quantity: number;
}

export interface CartItem {
    productVariantId: number;
    productTitle: string;
    productImage: string;
    variantName: string;
    colorName: string;
    sizeName: string;
    price: number;
    originalPrice: number;
    quantity: number;
    subTotal: number;
    availableStock: number;
    inStock: boolean;
}

export interface CartSummary {
    items: CartItem[];
    totalItems: number;
    subTotal: number;
    totalAmount: number;
    hasOutOfStockItems: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[];
}

// Cart Services
const cartServices = {
    // Get cart items
    getCart: async (): Promise<ApiResponse<CartSummary>> => {
        const response = await api.get('/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (item: AddToCartRequest): Promise<ApiResponse<string>> => {
        const response = await api.post('/cart/add', item);
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (item: UpdateCartItemRequest): Promise<ApiResponse<string>> => {
        const response = await api.put('/cart/update', item);
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (productVariantId: number): Promise<ApiResponse<string>> => {
        const response = await api.delete(`/cart/remove/${productVariantId}`);
        return response.data;
    },

    // Clear entire cart
    clearCart: async (): Promise<ApiResponse<string>> => {
        const response = await api.delete('/cart/clear');
        return response.data;
    },

    // Get cart item count
    getCartItemCount: async (): Promise<ApiResponse<number>> => {
        const response = await api.get('/cart/count');
        return response.data;
    }
};

export default cartServices;