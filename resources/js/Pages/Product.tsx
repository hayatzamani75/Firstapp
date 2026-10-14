import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { MakeToastSuccess } from '@/Components/MakeToast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, ProductPageProps, Product as StoreProduct } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Filter,
    Minus,
    Package,
    Plus,
    Search,
    ShoppingBag,
    ShoppingCart,
    SlidersHorizontal,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

const productCategories = [
    "Men's Clothing",
    "Women's Clothing",
    'Clothing',
    'Shoes',
    'Boots',
    'Sportswear',
    'Bags',
    'Accessories',
];

const shopCollections = [
    { label: 'All Products', value: 'all' as const },
    { label: 'New Arrivals', value: 'new' as const },
    { label: 'Best Sellers', value: null },
    { label: 'On Sale', value: 'sale' as const },
];

type ProductFormData = {
    image: File | null;
    name: string;
    category: string;
    description: string;
    price: string;
    discount_price: string;
    brand: string;
    sizes: string[];
    colors: string[];
    stock_quantity: string;
    sku: string;
};

type ProductInertiaProps = PageProps<
    ProductPageProps & Record<string, unknown>
>;

const money = (amount: number | string) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(amount));

function StoreImage({
    src,
    alt,
    className = '',
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div
                className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
            >
                <Package className="h-9 w-9" aria-hidden="true" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover ${className}`}
        />
    );
}

export default function Product() {
    const {
        auth,
        products,
        categories,
        filterOptions,
        filters,
        cartItems,
        cartCount,
        cartTotal,
    } = usePage<ProductInertiaProps>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [detailProduct, setDetailProduct] = useState<StoreProduct | null>(
        null,
    );
    const [productToDelete, setProductToDelete] =
        useState<StoreProduct | null>(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [detailQuantity, setDetailQuantity] = useState(1);
    const [search, setSearch] = useState(filters.search);
    const [minPrice, setMinPrice] = useState(String(filters.price_min ?? ''));
    const [maxPrice, setMaxPrice] = useState(String(filters.price_max ?? ''));
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [cartErrors, setCartErrors] = useState<Record<string, string>>({});
    const form = useForm<ProductFormData>({
        image: null,
        name: '',
        category: '',
        description: '',
        price: '',
        discount_price: '',
        brand: '',
        sizes: [],
        colors: [],
        stock_quantity: '1',
        sku: '',
    });

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    function applyFilters(patch: Partial<ProductPageProps['filters']>) {
        const query: Record<string, string | number> = {};
        Object.entries({ ...filters, ...patch }).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined)
                query[key] = value;
        });
        query.page = 1;
        router.get(route('product.view'), query, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        applyFilters({ search });
    }

    function submitPriceFilter(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        applyFilters({ price_min: minPrice, price_max: maxPrice });
    }

    function openDetails(product: StoreProduct) {
        setDetailProduct(product);
        setSelectedSize(product.sizes?.[0] ?? '');
        setSelectedColor(product.colors?.[0] ?? '');
        setDetailQuantity(1);
        setCartErrors({});
    }

    function addToCart(
        product: StoreProduct,
        size: string | null,
        color: string | null,
        quantity: number,
    ) {
        setCartErrors({});
        router.post(
            route('product.cart.add'),
            { product_id: product.id, size, color, quantity },
            {
                preserveScroll: true,
                onError: (errors) =>
                    setCartErrors(errors as Record<string, string>),
                onSuccess: (response) => {
                    const message = response.props.flash.success;
                    if (message) MakeToastSuccess(message);
                    setDetailProduct(null);
                },
            },
        );
    }

    function quickAdd(product: StoreProduct) {
        if (
            (product.sizes?.length ?? 0) > 0 ||
            (product.colors?.length ?? 0) > 0
        ) {
            openDetails(product);
            return;
        }
        addToCart(product, null, null, 1);
    }

    function submitProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(route('product.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
                form.reset();
                setImagePreview(null);
                setIsAddOpen(false);
            },
        });
    }

    function updateCartQuantity(itemKey: string, quantity: number) {
        setCartErrors({});
        router.patch(
            route('product.cart.update'),
            { item_key: itemKey, quantity },
            {
                preserveScroll: true,
                onSuccess: (response) => {
                    const message = response.props.flash.success;
                    if (message) MakeToastSuccess(message);
                },
                onError: (errors) =>
                    setCartErrors(errors as Record<string, string>),
            },
        );
    }

    function removeCartItem(itemKey: string) {
        setCartErrors({});
        router.delete(route('product.cart.remove'), {
            data: { item_key: itemKey },
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
            },
            onError: (errors) =>
                setCartErrors(errors as Record<string, string>),
        });
    }

    function deleteProduct() {
        if (!productToDelete) return;

        router.delete(route('product.destroy', productToDelete.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
                setProductToDelete(null);
            },
        });
    }

    function renderNavigation(mobile = false) {
        const links = [
            { label: 'Home', href: '/' },
            { label: 'All Products', href: route('product.view') },
            { label: 'Categories', href: '#categories' },
            {
                label: 'New Arrivals',
                href: route('product.view', { collection: 'new' }),
            },
            { label: 'Contact Us', href: null },
        ];

        return links.map((item) => {
            const className = mobile
                ? 'block rounded-md px-3 py-2 text-sm font-medium'
                : 'whitespace-nowrap text-sm font-medium';
            const onClick = mobile ? () => setIsMenuOpen(false) : undefined;
            if (!item.href)
                return (
                    <span
                        key={item.label}
                        aria-disabled="true"
                        className={`${className} cursor-not-allowed text-slate-400`}
                    >
                        {item.label}
                    </span>
                );
            if (item.href.startsWith('#'))
                return (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={onClick}
                        className={`${className} text-slate-700 transition hover:text-blue-700`}
                    >
                        {item.label}
                    </a>
                );
            return (
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClick}
                    className={`${className} text-slate-700 transition hover:text-blue-700`}
                >
                    {item.label}
                </Link>
            );
        });
    }

    return (
        <AuthenticatedLayout hideNavigation hideAccountMenu>
            <Head title="Products" />
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <header className="sticky top-0 z-40 border-b border-blue-100 bg-white shadow-sm">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2.5"
                            aria-label="KIC Store home"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </span>
                            <span className="text-base font-bold text-slate-900 sm:text-lg">
                                KIC Store
                            </span>
                        </Link>
                        <nav
                            aria-label="Main navigation"
                            className="hidden flex-1 items-center justify-center gap-5 xl:flex"
                        >
                            {renderNavigation()}
                        </nav>
                        <form
                            onSubmit={submitSearch}
                            className="ml-auto hidden w-full max-w-xs md:block"
                        >
                            <label className="relative block">
                                <span className="sr-only">Search products</span>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search products"
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                        </form>
                        <Link
                            href={route('profile.edit')}
                            aria-label="Account"
                            title="Account"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <UserRound className="h-5 w-5" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            aria-label={`Shopping cart, ${cartCount} items`}
                            title="Shopping cart"
                            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 xl:hidden"
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Filter className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {isMenuOpen && (
                        <div className="border-t border-slate-100 bg-white px-4 py-4 xl:hidden">
                            <form
                                onSubmit={submitSearch}
                                className="mb-3 md:hidden"
                            >
                                <label className="relative block">
                                    <span className="sr-only">
                                        Search products
                                    </span>
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search products"
                                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </form>
                            <nav
                                aria-label="Mobile navigation"
                                className="space-y-1"
                            >
                                {renderNavigation(true)}
                            </nav>
                        </div>
                    )}
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
                                KIC Store
                            </p>
                            <h1 className="mt-1 text-3xl font-bold text-slate-900">
                                Clothing, shoes & accessories
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Browse the collection and find your next
                                favorite.
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsAddOpen(true)}
                            className="h-11 bg-blue-700 text-white hover:bg-blue-800"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Product
                        </Button>
                    </div>
                    <form
                        onSubmit={submitSearch}
                        className="mb-5 flex gap-2 md:hidden"
                    >
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Search products</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search products"
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </label>
                        <Button
                            type="submit"
                            aria-label="Search"
                            className="bg-blue-700 hover:bg-blue-800"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="mb-4 flex items-center justify-between lg:hidden">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen((open) => !open)}
                            aria-expanded={isSidebarOpen}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </button>
                        <span className="text-sm text-slate-500">
                            {products.total} products
                        </span>
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
                        <aside
                            className={`${isSidebarOpen ? 'block' : 'hidden'} space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:block`}
                        >
                            <div>
                                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Shop
                                </h2>
                                <nav
                                    aria-label="Product collections"
                                    className="space-y-1"
                                >
                                    {shopCollections.map((collection) => {
                                        const active =
                                            collection.value !== null &&
                                            filters.collection ===
                                                collection.value;
                                        if (collection.value === null)
                                            return (
                                                <span
                                                    key={collection.label}
                                                    aria-disabled="true"
                                                    title="Sales data is not available"
                                                    className="block cursor-not-allowed rounded-lg px-3 py-2 text-sm text-slate-400"
                                                >
                                                    {collection.label}
                                                    <span className="ml-2 text-[10px] uppercase">
                                                        Unavailable
                                                    </span>
                                                </span>
                                            );
                                        return (
                                            <button
                                                key={collection.label}
                                                type="button"
                                                onClick={() =>
                                                    applyFilters({
                                                        collection:
                                                            collection.value,
                                                        category: '',
                                                    })
                                                }
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${active ? 'bg-blue-50 font-semibold text-blue-800' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'}`}
                                            >
                                                {collection.label}
                                                {active && (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            <div>
                                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Categories
                                </h2>
                                <div className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            applyFilters({ category: '' })
                                        }
                                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${filters.category === '' ? 'bg-blue-50 font-semibold text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        All categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                applyFilters({
                                                    category,
                                                    collection: 'all',
                                                })
                                            }
                                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${filters.category === category ? 'bg-blue-50 font-semibold text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="px-3 py-2 text-xs leading-5 text-slate-400">
                                            Categories will appear as products
                                            are added.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Quick Filters
                                </h2>
                                <form
                                    onSubmit={submitPriceFilter}
                                    className="space-y-4"
                                >
                                    <fieldset>
                                        <legend className="mb-2 text-sm font-medium text-slate-700">
                                            Price Range
                                        </legend>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                aria-label="Minimum price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Min"
                                                value={minPrice}
                                                onChange={(event) =>
                                                    setMinPrice(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-9"
                                            />
                                            <Input
                                                aria-label="Maximum price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Max"
                                                value={maxPrice}
                                                onChange={(event) =>
                                                    setMaxPrice(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-9"
                                            />
                                        </div>
                                    </fieldset>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Size
                                        <select
                                            value={filters.size}
                                            disabled={
                                                filterOptions.sizes.length === 0
                                            }
                                            onChange={(event) =>
                                                applyFilters({
                                                    size: event.target.value,
                                                })
                                            }
                                            className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                                        >
                                            <option value="">All sizes</option>
                                            {filterOptions.sizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Color
                                        <select
                                            value={filters.color}
                                            disabled={
                                                filterOptions.colors.length ===
                                                0
                                            }
                                            onChange={(event) =>
                                                applyFilters({
                                                    color: event.target.value,
                                                })
                                            }
                                            className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                                        >
                                            <option value="">All colors</option>
                                            {filterOptions.colors.map(
                                                (color) => (
                                                    <option
                                                        key={color}
                                                        value={color}
                                                    >
                                                        {color}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </label>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Brand
                                        <select
                                            value={filters.brand}
                                            disabled={
                                                filterOptions.brands.length ===
                                                0
                                            }
                                            onChange={(event) =>
                                                applyFilters({
                                                    brand: event.target.value,
                                                })
                                            }
                                            className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm disabled:bg-slate-50 disabled:text-slate-400"
                                        >
                                            <option value="">All brands</option>
                                            {filterOptions.brands.map(
                                                (brand) => (
                                                    <option
                                                        key={brand}
                                                        value={brand}
                                                    >
                                                        {brand}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </label>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Availability
                                        <select
                                            value={filters.availability}
                                            onChange={(event) =>
                                                applyFilters({
                                                    availability: event.target
                                                        .value as ProductPageProps['filters']['availability'],
                                                })
                                            }
                                            className="mt-2 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm"
                                        >
                                            <option value="">
                                                Any availability
                                            </option>
                                            <option value="in_stock">
                                                In stock
                                            </option>
                                            <option value="out_of_stock">
                                                Out of stock
                                            </option>
                                        </select>
                                    </label>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        className="w-full border-blue-200 text-blue-800 hover:bg-blue-50"
                                    >
                                        Apply price
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMinPrice('');
                                            setMaxPrice('');
                                            setSearch('');
                                            applyFilters({
                                                search: '',
                                                category: '',
                                                collection: 'all',
                                                price_min: '',
                                                price_max: '',
                                                size: '',
                                                color: '',
                                                brand: '',
                                                availability: '',
                                            });
                                        }}
                                        className="w-full text-center text-xs font-medium text-slate-500 hover:text-blue-700"
                                    >
                                        Clear filters
                                    </button>
                                </form>
                            </div>
                        </aside>

                        <section
                            aria-labelledby="products-heading"
                            className="min-w-0"
                        >
                            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2
                                        id="products-heading"
                                        className="text-lg font-semibold text-slate-900"
                                    >
                                        All Products
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Showing {products.from ?? 0}–
                                        {products.to ?? 0} of {products.total}
                                    </p>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    Sort
                                    <select
                                        value={filters.sort}
                                        onChange={(event) =>
                                            applyFilters({
                                                sort: event.target
                                                    .value as ProductPageProps['filters']['sort'],
                                            })
                                        }
                                        className="h-9 rounded-md border border-slate-200 bg-white px-2 font-medium text-slate-700"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price_asc">
                                            Price: low to high
                                        </option>
                                        <option value="price_desc">
                                            Price: high to low
                                        </option>
                                    </select>
                                </label>
                            </div>
                            {products.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                                    {products.data.map((product) => {
                                        const onSale =
                                            product.discount_price !== null &&
                                            Number(product.discount_price) <
                                                Number(product.price);
                                        return (
                                            <article
                                                key={product.id}
                                                className="group min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDetails(product)
                                                    }
                                                    className="relative block aspect-[4/5] w-full overflow-hidden bg-slate-100 text-left"
                                                >
                                                    <StoreImage
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="transition duration-300 group-hover:scale-[1.03]"
                                                    />
                                                    {onSale && (
                                                        <span className="absolute left-3 top-3 rounded-full bg-blue-700 px-2.5 py-1 text-xs font-bold text-white">
                                                            Sale
                                                        </span>
                                                    )}
                                                    {product.stock_quantity ===
                                                        0 && (
                                                        <span className="absolute inset-x-0 bottom-0 bg-slate-900/75 px-3 py-2 text-center text-xs font-semibold text-white">
                                                            Out of stock
                                                        </span>
                                                    )}
                                                </button>
                                                <div className="p-3 sm:p-4">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                                                        {product.category}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDetails(product)
                                                        }
                                                        className="mt-1 line-clamp-2 min-h-10 text-left text-sm font-semibold text-slate-900 hover:text-blue-700 sm:text-base"
                                                    >
                                                        {product.name}
                                                    </button>
                                                    {product.brand && (
                                                        <p className="mt-1 truncate text-xs text-slate-500">
                                                            {product.brand}
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                                                        <span className="font-bold text-slate-900">
                                                            {money(
                                                                product.effective_price,
                                                            )}
                                                        </span>
                                                        {onSale && (
                                                            <span className="text-xs text-slate-400 line-through">
                                                                {money(
                                                                    product.price,
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                openDetails(
                                                                    product,
                                                                )
                                                            }
                                                            className="min-w-0 px-2 text-xs"
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            disabled={
                                                                product.stock_quantity ===
                                                                0
                                                            }
                                                            onClick={() =>
                                                                quickAdd(
                                                                    product,
                                                                )
                                                            }
                                                            className="min-w-0 bg-blue-700 px-2 text-xs hover:bg-blue-800"
                                                        >
                                                            <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                                                            Add
                                                        </Button>
                                                    </div>
                                                    {product.created_by ===
                                                        auth.user.id && (
                                                            <Button
                                                                type="button"
                                                                onClick={() =>
                                                                    setProductToDelete(
                                                                        product,
                                                                    )
                                                                }
                                                                className="mt-2 w-full bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Product
                                                            </Button>
                                                        )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-white px-6 py-12 text-center shadow-sm">
                                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                        <Package className="h-6 w-6" />
                                    </span>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        No products found
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Add a product to start building your
                                        catalog, or adjust your search and
                                        filters.
                                    </p>
                                    <Button
                                        onClick={() => setIsAddOpen(true)}
                                        className="mt-5 bg-blue-700 hover:bg-blue-800"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Product
                                    </Button>
                                </div>
                            )}
                            {products.last_page > 1 && (
                                <nav
                                    aria-label="Product pagination"
                                    className="mt-6 flex flex-wrap items-center justify-center gap-2"
                                >
                                    {products.links.map((link, index) => {
                                        const label = link.label
                                            .replace(/&laquo;|&raquo;/g, '')
                                            .trim();
                                        const previous = label
                                            .toLowerCase()
                                            .includes('previous');
                                        const next = label
                                            .toLowerCase()
                                            .includes('next');
                                        return link.url ? (
                                            <Link
                                                key={`${link.label}-${index}`}
                                                href={link.url}
                                                preserveScroll
                                                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm ${link.active ? 'border-blue-700 bg-blue-700 font-semibold text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50'}`}
                                            >
                                                {previous ? (
                                                    <ChevronLeft className="h-4 w-4" />
                                                ) : next ? (
                                                    <ChevronRight className="h-4 w-4" />
                                                ) : (
                                                    label
                                                )}
                                            </Link>
                                        ) : (
                                            <span
                                                key={`${link.label}-${index}`}
                                                aria-disabled="true"
                                                className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-100 px-3 text-sm text-slate-300"
                                            >
                                                {previous ? (
                                                    <ChevronLeft className="h-4 w-4" />
                                                ) : next ? (
                                                    <ChevronRight className="h-4 w-4" />
                                                ) : (
                                                    label
                                                )}
                                            </span>
                                        );
                                    })}
                                </nav>
                            )}
                        </section>
                    </div>
                </main>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-blue-100 bg-slate-50 p-0 sm:max-w-2xl">
                        <DialogHeader className="rounded-t-xl bg-blue-800 px-5 py-5 text-left text-white sm:px-6">
                            <DialogTitle className="text-white">
                                Add New Product
                            </DialogTitle>
                            <DialogDescription className="text-blue-100">
                                Enter product details and upload a product
                                photo.
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={submitProduct}
                            className="space-y-4 px-5 py-5 sm:px-6"
                        >
                            <div>
                                <label
                                    htmlFor="product-image"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Product image
                                </label>
                                <input
                                    id="product-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => {
                                        const file =
                                            event.currentTarget.files?.[0] ??
                                            null;
                                        form.setData('image', file);
                                        setImagePreview(
                                            file
                                                ? URL.createObjectURL(file)
                                                : null,
                                        );
                                    }}
                                    className="block w-full rounded-lg border border-slate-200 bg-white p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-semibold file:text-blue-800"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    JPG, PNG, or WebP. Maximum size 5 MB.
                                </p>
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Selected product preview"
                                        className="mt-3 h-40 w-32 rounded-lg border border-slate-200 object-cover"
                                    />
                                )}
                                {form.errors.image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {form.errors.image}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="product-name"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Product name *
                                    </label>
                                    <Input
                                        id="product-name"
                                        value={form.data.name}
                                        onChange={(event) =>
                                            form.setData(
                                                'name',
                                                event.target.value,
                                            )
                                        }
                                        required
                                        maxLength={255}
                                    />
                                    {form.errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-category"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Category *
                                    </label>
                                    <select
                                        id="product-category"
                                        value={form.data.category}
                                        onChange={(event) =>
                                            form.setData(
                                                'category',
                                                event.target.value,
                                            )
                                        }
                                        required
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                                    >
                                        <option value="">
                                            Choose a category
                                        </option>
                                        {productCategories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.category && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.category}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-price"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Price *
                                    </label>
                                    <Input
                                        id="product-price"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={form.data.price}
                                        onChange={(event) =>
                                            form.setData(
                                                'price',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {form.errors.price && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-discount"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Discount price
                                    </label>
                                    <Input
                                        id="product-discount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.discount_price}
                                        onChange={(event) =>
                                            form.setData(
                                                'discount_price',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {form.errors.discount_price && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.discount_price}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-brand"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Brand
                                    </label>
                                    <Input
                                        id="product-brand"
                                        value={form.data.brand}
                                        onChange={(event) =>
                                            form.setData(
                                                'brand',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={120}
                                    />
                                    {form.errors.brand && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.brand}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-stock"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Stock quantity *
                                    </label>
                                    <Input
                                        id="product-stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={form.data.stock_quantity}
                                        onChange={(event) =>
                                            form.setData(
                                                'stock_quantity',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {form.errors.stock_quantity && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.stock_quantity}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-sizes"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Sizes
                                    </label>
                                    <Input
                                        id="product-sizes"
                                        placeholder="S, M, L, XL or 8, 9, 10"
                                        value={form.data.sizes.join(', ')}
                                        onChange={(event) =>
                                            form.setData(
                                                'sizes',
                                                event.target.value
                                                    .split(',')
                                                    .map((value) =>
                                                        value.trim(),
                                                    )
                                                    .filter(Boolean),
                                            )
                                        }
                                    />
                                    {form.errors.sizes && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.sizes}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="product-colors"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Colors
                                    </label>
                                    <Input
                                        id="product-colors"
                                        placeholder="Black, White, Navy"
                                        value={form.data.colors.join(', ')}
                                        onChange={(event) =>
                                            form.setData(
                                                'colors',
                                                event.target.value
                                                    .split(',')
                                                    .map((value) =>
                                                        value.trim(),
                                                    )
                                                    .filter(Boolean),
                                            )
                                        }
                                    />
                                    {form.errors.colors && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.colors}
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="product-sku"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        SKU / product code
                                    </label>
                                    <Input
                                        id="product-sku"
                                        value={form.data.sku}
                                        onChange={(event) =>
                                            form.setData(
                                                'sku',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={100}
                                    />
                                    {form.errors.sku && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.sku}
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="product-description"
                                        className="mb-1.5 block text-sm font-medium"
                                    >
                                        Description
                                    </label>
                                    <Textarea
                                        id="product-description"
                                        rows={4}
                                        value={form.data.description}
                                        onChange={(event) =>
                                            form.setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        maxLength={5000}
                                    />
                                    {form.errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {form.errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="bg-blue-700 hover:bg-blue-800"
                                >
                                    {form.processing
                                        ? 'Saving…'
                                        : 'Save Product'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={detailProduct !== null}
                    onOpenChange={(open) => {
                        if (!open) setDetailProduct(null);
                    }}
                >
                    {detailProduct && (
                        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-blue-100 bg-white p-0 sm:max-w-3xl">
                            <div className="grid md:grid-cols-2">
                                <div className="aspect-[4/5] bg-slate-100 md:aspect-auto md:min-h-[480px]">
                                    <StoreImage
                                        src={detailProduct.image_url}
                                        alt={detailProduct.name}
                                    />
                                </div>
                                <div className="flex flex-col p-5 sm:p-7">
                                    <DialogHeader className="text-left">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                            {detailProduct.category}
                                        </p>
                                        <DialogTitle className="pr-8 text-2xl text-slate-900">
                                            {detailProduct.name}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {detailProduct.brand ||
                                                'KIC Store collection'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-5 flex items-baseline gap-3">
                                        <span className="text-xl font-bold text-slate-900">
                                            {money(
                                                detailProduct.effective_price,
                                            )}
                                        </span>
                                        {detailProduct.discount_price &&
                                            Number(
                                                detailProduct.discount_price,
                                            ) < Number(detailProduct.price) && (
                                                <span className="text-sm text-slate-400 line-through">
                                                    {money(detailProduct.price)}
                                                </span>
                                            )}
                                    </div>
                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                        {detailProduct.description ||
                                            'No description provided.'}
                                    </p>
                                    <p
                                        className={`mt-4 text-sm font-medium ${detailProduct.stock_quantity > 0 ? 'text-emerald-700' : 'text-red-600'}`}
                                    >
                                        {detailProduct.stock_quantity > 0
                                            ? `${detailProduct.stock_quantity} in stock`
                                            : 'Out of stock'}
                                    </p>
                                    {Boolean(detailProduct.sizes?.length) && (
                                        <label className="mt-5 block text-sm font-medium text-slate-700">
                                            Size
                                            <select
                                                value={selectedSize}
                                                onChange={(event) =>
                                                    setSelectedSize(
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3"
                                            >
                                                {detailProduct.sizes?.map(
                                                    (size) => (
                                                        <option
                                                            key={size}
                                                            value={size}
                                                        >
                                                            {size}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </label>
                                    )}
                                    {Boolean(detailProduct.colors?.length) && (
                                        <label className="mt-4 block text-sm font-medium text-slate-700">
                                            Color
                                            <select
                                                value={selectedColor}
                                                onChange={(event) =>
                                                    setSelectedColor(
                                                        event.target.value,
                                                    )
                                                }
                                                className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3"
                                            >
                                                {detailProduct.colors?.map(
                                                    (color) => (
                                                        <option
                                                            key={color}
                                                            value={color}
                                                        >
                                                            {color}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </label>
                                    )}
                                    <label className="mt-4 block text-sm font-medium text-slate-700">
                                        Quantity
                                        <input
                                            type="number"
                                            min={1}
                                            max={detailProduct.stock_quantity}
                                            value={detailQuantity}
                                            onChange={(event) =>
                                                setDetailQuantity(
                                                    Math.max(
                                                        1,
                                                        Math.min(
                                                            detailProduct.stock_quantity,
                                                            Number(
                                                                event.target
                                                                    .value,
                                                            ) || 1,
                                                        ),
                                                    ),
                                                )
                                            }
                                            className="mt-2 h-10 w-24 rounded-md border border-slate-200 px-3"
                                        />
                                    </label>
                                    {cartErrors.cart && (
                                        <p
                                            role="alert"
                                            className="mt-3 text-sm text-red-600"
                                        >
                                            {cartErrors.cart}
                                        </p>
                                    )}
                                    {cartErrors.size && (
                                        <p
                                            role="alert"
                                            className="mt-1 text-sm text-red-600"
                                        >
                                            {cartErrors.size}
                                        </p>
                                    )}
                                    {cartErrors.color && (
                                        <p
                                            role="alert"
                                            className="mt-1 text-sm text-red-600"
                                        >
                                            {cartErrors.color}
                                        </p>
                                    )}
                                    <Button
                                        type="button"
                                        disabled={
                                            detailProduct.stock_quantity === 0
                                        }
                                        onClick={() =>
                                            addToCart(
                                                detailProduct,
                                                selectedSize || null,
                                                selectedColor || null,
                                                detailQuantity,
                                            )
                                        }
                                        className="mt-auto bg-blue-700 hover:bg-blue-800"
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>

                <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-blue-100 bg-white p-0 sm:max-w-xl">
                        <DialogHeader className="bg-blue-800 px-5 py-5 text-left text-white sm:px-6">
                            <DialogTitle className="text-white">
                                Shopping Cart ({cartCount})
                            </DialogTitle>
                            <DialogDescription className="text-blue-100">
                                Cart updates are saved to your session. Checkout
                                is not available.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 px-5 py-5 sm:px-6">
                            {cartErrors.cart && (
                                <p
                                    role="alert"
                                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                                >
                                    {cartErrors.cart}
                                </p>
                            )}
                            {cartItems.length === 0 ? (
                                <p className="py-10 text-center text-sm text-slate-500">
                                    Your cart is empty.
                                </p>
                            ) : (
                                cartItems.map((item) => (
                                    <article
                                        key={item.key}
                                        className="flex gap-3 border-b border-slate-100 pb-4"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-24 w-20 rounded-lg bg-slate-100 object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-slate-900">
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {[item.size, item.color]
                                                    .filter(Boolean)
                                                    .join(' · ') ||
                                                    item.category}
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                {money(item.unit_price)} each
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.key,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    aria-label={`Decrease ${item.name} quantity`}
                                                    className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 disabled:opacity-40"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="min-w-5 text-center text-sm tabular-nums">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock_quantity
                                                    }
                                                    onClick={() =>
                                                        updateCartQuantity(
                                                            item.key,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    aria-label={`Increase ${item.name} quantity`}
                                                    className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 disabled:opacity-40"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeCartItem(item.key)
                                                    }
                                                    className="ml-auto text-xs font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                        <p className="shrink-0 text-sm font-bold text-slate-900">
                                            {money(item.subtotal)}
                                        </p>
                                    </article>
                                ))
                            )}
                            {cartItems.length > 0 && (
                                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                                    <span className="font-semibold text-slate-700">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-slate-900">
                                        {money(cartTotal)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                <AlertDialog
                    open={productToDelete !== null}
                    onOpenChange={(open) => {
                        if (!open) setProductToDelete(null);
                    }}
                >
                    <AlertDialogContent className="w-[calc(100%-2rem)] rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                            <AlertDialogDescription>
                                “{productToDelete?.name}” and its stored image will be permanently deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={deleteProduct}
                                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                            >
                                Delete Product
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AuthenticatedLayout>
    );
}
