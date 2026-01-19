export interface Product {
    _id?: string;
    name: string;
    price: number;
    stock: number;
}

export interface Customer {
    _id?: string;
    name: string;
    phoneOrEmail: string;
    purchasesCount?: number;
}

export interface SaleItem {
    product?: string | any; // Product ID or populated object (response)
    productId?: string;     // Explicit ID (request)
    productNameSnapshot: string;
    quantity: number;
    unitPriceSnapshot: number;
    lineTotal: number;
}

export interface Sale {
    _id?: string;
    customer: string | null; // Customer ID or null
    items: SaleItem[];
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    total: number;
    paymentMethod: string;
}
