import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    lastname: string | null;
    username: string | null;
    email: string;
    role: 'employee' | 'manager' | 'customer';
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        unreadOrderNotifications?: number;
    };
    flash: {
        success?: string;
        error?: string;
    };
    ziggy: Config & { location: string };
};

export interface Note {
    id: number;
    title: string;
    description: string;
}

export interface Book {
    id: number;
    name: string;
    title: string;
    description: string;
}

export interface Company {
    id: number;
    name: string;
    type: string;
    address: string;
}

export interface Teacher {
    id: number;
    name: string;
    lastname: string;
    position: string;
    email: string;
    phone_number_1?: string | null;
    phone_number_2?: string | null;
    address: string;
}

export interface Customer {
    id: number;
    name: string;
    lastname: string;
    email: string;
    phone?: string | null;
    address: string;
}

export interface Internship {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    address: string | null;
    contract: string;
}

export interface Employee {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    address: string | null;
}

export interface Service {
    id: number;
    name: string;
    service_type: string;
    parts: string;
    price: string;
}

export interface Product {
    id: number;
    created_by: number | null;
    name: string;
    category: string;
    description: string | null;
    price: string;
    discount_price: string | null;
    effective_price: number;
    brand: string | null;
    sizes: string[] | null;
    colors: string[] | null;
    stock_quantity: number;
    sku: string | null;
    image_url: string;
    created_at: string;
}

export interface ProductFilterState {
    search: string;
    category: string;
    collection: 'all' | 'new' | 'sale';
    sort: 'newest' | 'price_asc' | 'price_desc';
    price_min: string | number;
    price_max: string | number;
    size: string;
    color: string;
    brand: string;
    availability: '' | 'in_stock' | 'out_of_stock';
}

export interface ProductCartItem {
    key: string;
    product_id: number;
    name: string;
    category: string;
    image_url: string;
    size: string | null;
    color: string | null;
    quantity: number;
    stock_quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface ProductPageProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: string[];
    filterOptions: {
        sizes: string[];
        colors: string[];
        brands: string[];
    };
    filters: ProductFilterState;
    cartItems: ProductCartItem[];
    cartCount: number;
    cartTotal: number;
}

export interface OrderItemRecord {
    id: number;
    product_id: number | null;
    product_name: string;
    category: string;
    sku: string | null;
    size: string | null;
    color: string | null;
    unit_price: string;
    quantity: number;
    line_total: string;
}

export interface OrderRecord {
    id: number;
    user_id: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: string;
    created_at: string;
    employee_reply: string | null;
    user?: Pick<User, 'id' | 'name' | 'email'>;
    items: OrderItemRecord[];
}

export interface OrderPageProps {
    isEmployee: boolean;
    orderNotifications: {
        id: string;
        data: { order_id: number; customer_name: string; total: string; message: string };
        created_at: string;
    }[];
    orders: {
        data: OrderRecord[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}
