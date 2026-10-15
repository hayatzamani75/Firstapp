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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PageProps,
    ProductPageProps,
    Product as StoreProduct,
    User,
} from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Filter,
    LogOut,
    Minus,
    Package,
    Pencil,
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
    fit = 'contain',
}: {
    src: string;
    alt: string;
    className?: string;
    fit?: 'contain' | 'cover';
}) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

    if (failedSrc === src) {
        return (
            <div
                className={`flex items-center justify-center bg-[#F8F6F2] text-[#B89B72] ${className}`}
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
            onError={() => setFailedSrc(src)}
            className={`h-full w-full ${fitClass} ${className}`}
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
    const currentUser = auth.user as User | null;
    const isEmployee = currentUser?.role === 'employee';
    const unreadOrderNotifications = Number(auth.unreadOrderNotifications ?? 0);
    useEffect(() => {
        if (!isEmployee) return;

        const timer = window.setInterval(() => {
            router.reload({ only: ['auth'], preserveState: true, preserveScroll: true });
        }, 30000);

        return () => window.clearInterval(timer);
    }, [isEmployee]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [productBeingEdited, setProductBeingEdited] =
        useState<StoreProduct | null>(null);
    const [detailProduct, setDetailProduct] = useState<StoreProduct | null>(
        null,
    );
    const [productToDelete, setProductToDelete] = useState<StoreProduct | null>(
        null,
    );
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
    const registrationForm = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    function submitRegistration(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        registrationForm.post(route('register'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsRegisterOpen(false);
                registrationForm.reset();
            },
            onFinish: () =>
                registrationForm.reset('password', 'password_confirmation'),
        });
    }

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

    function openCreateProduct() {
        setProductBeingEdited(null);
        form.reset();
        form.clearErrors();
        setImagePreview(null);
        setIsAddOpen(true);
    }

    function openEditProduct(product: StoreProduct) {
        setProductBeingEdited(product);
        form.clearErrors();
        form.setData({
            image: null,
            name: product.name,
            category: product.category,
            description: product.description ?? '',
            price: product.price,
            discount_price: product.discount_price ?? '',
            brand: product.brand ?? '',
            sizes: product.sizes ?? [],
            colors: product.colors ?? [],
            stock_quantity: String(product.stock_quantity),
            sku: product.sku ?? '',
        });
        setImagePreview(product.image_url);
        setIsAddOpen(true);
    }

    function submitProduct(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const options: Parameters<typeof form.post>[1] = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
                form.reset();
                setImagePreview(null);
                setProductBeingEdited(null);
                setIsAddOpen(false);
            },
        };

        if (productBeingEdited) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(route('product.update', productBeingEdited.id), {
                ...options,
                onFinish: () => form.transform((data) => data),
            });
            return;
        }

        form.post(route('product.store'), options);
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

    function placeOrder() {
        if (!currentUser) {
            router.visit(route('login'));
            return;
        }

        setCartErrors({});
        router.post(route('checkout.store'), {}, {
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
                setIsCartOpen(false);
            },
            onError: (errors) => setCartErrors(errors as Record<string, string>),
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
                        className={`${className} text-slate-700 transition hover:text-[#8F744F]`}
                    >
                        {item.label}
                    </a>
                );
            return (
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClick}
                    className={`${className} text-slate-700 transition hover:text-[#8F744F]`}
                >
                    {item.label}
                </Link>
            );
        });
    }

    return (
        <AuthenticatedLayout hideNavigation hideAccountMenu>
            <Head title="Products" />
            <div className="min-h-screen bg-[#F8F6F2] text-[#171717]">
                <header className="sticky top-0 z-40 border-b border-[#EAE6DE] bg-white shadow-[0_2px_18px_rgba(23,23,23,0.04)]">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="flex shrink-0 items-center gap-2.5"
                            aria-label="KIC Store home"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717] text-white shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </span>
                            <span className="text-base font-semibold text-[#171717] sm:text-lg">
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
                                    className="h-10 w-full rounded-lg border border-[#EAE6DE] bg-[#F8F6F2] pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#B89B72] focus:ring-2 focus:ring-[#B89B72]/20"
                                />
                            </label>
                        </form>
                        {currentUser ? (
                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    href={route('orders.index')}
                                    aria-label={isEmployee ? 'Orders' : 'My orders'}
                                    title={isEmployee ? 'Orders' : 'My orders'}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE6DE] text-[#171717] transition hover:border-[#B89B72]/50 hover:bg-[#F8F6F2] hover:text-[#8F744F]"
                                >
                                    <ClipboardList className="h-5 w-5" />
                                    {isEmployee && unreadOrderNotifications > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                                            {unreadOrderNotifications > 9 ? '9+' : unreadOrderNotifications}
                                        </span>
                                    )}
                                </Link>
                                {isEmployee && <Link
                                    href={route('profile.edit')}
                                    aria-label="Account"
                                    title={currentUser.name}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAE6DE] text-[#171717] transition hover:border-[#B89B72]/50 hover:bg-[#F8F6F2] hover:text-[#8F744F]"
                                >
                                    <UserRound className="h-5 w-5" />
                                </Link>}
                                {isEmployee && <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRegisterOpen(true)}
                                    className="hidden h-10 rounded-lg border border-[#EAE6DE] bg-white px-3 text-sm font-medium text-[#171717] shadow-none transition hover:bg-[#F8F6F2] sm:flex"
                                >
                                    Register
                                </Button>}
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    aria-label="Log out"
                                    title="Log out"
                                    className="hidden h-10 items-center gap-2 rounded-lg border border-[#EAE6DE] px-3 text-sm text-[#171717] transition hover:bg-[#F8F6F2] sm:flex"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </Link>
                            </div>
                        ) : (
                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg px-2 py-2 text-sm font-medium text-[#171717] hover:text-[#8F744F] sm:px-3"
                                >
                                    Log in
                                </Link>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsRegisterOpen(true)}
                                    className="h-10 rounded-lg border border-[#EAE6DE] bg-white px-3 text-sm font-medium text-[#171717] shadow-none transition hover:bg-[#F8F6F2]"
                                >
                                    Register
                                </Button>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            aria-label={`Shopping cart, ${cartCount} items`}
                            title="Shopping cart"
                            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#EAE6DE] text-[#171717] transition hover:border-[#B89B72]/50 hover:bg-[#F8F6F2] hover:text-[#8F744F]"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B89B72] px-1 text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#EAE6DE] text-[#171717] transition hover:bg-[#F8F6F2] xl:hidden"
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Filter className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <Dialog
                        open={isRegisterOpen}
                        onOpenChange={(open) => {
                            setIsRegisterOpen(open);
                            if (!open) registrationForm.reset();
                        }}
                    >
                        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-[#EAE6DE] bg-white p-0 sm:max-w-md">
                            <DialogHeader className="border-b border-[#EAE6DE] px-6 py-5 text-left">
                                <DialogTitle className="text-[#171717]">Create a customer account</DialogTitle>
                                <DialogDescription>
                                    {currentUser
                                        ? 'Create a customer account. Your current session will stay signed in; log out to sign in with the new account.'
                                        : 'Register to shop and place orders. You will be signed in after registration.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={submitRegistration} className="space-y-4 px-6 py-5">
                                <div>
                                    <label htmlFor="customer-register-name" className="mb-1.5 block text-sm font-medium text-slate-700">First name</label>
                                    <Input id="customer-register-name" value={registrationForm.data.name} onChange={(event) => registrationForm.setData('name', event.target.value)} autoComplete="name" maxLength={255} required className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.name && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="customer-register-lastname" className="mb-1.5 block text-sm font-medium text-slate-700">Last name</label>
                                    <Input id="customer-register-lastname" value={registrationForm.data.lastname} onChange={(event) => registrationForm.setData('lastname', event.target.value)} autoComplete="family-name" maxLength={255} required className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.lastname && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.lastname}</p>}
                                </div>
                                <div>
                                    <label htmlFor="customer-register-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                    <Input id="customer-register-email" type="email" value={registrationForm.data.email} onChange={(event) => registrationForm.setData('email', event.target.value)} autoComplete="email" maxLength={255} required className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.email && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="customer-register-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone (optional)</label>
                                    <Input id="customer-register-phone" type="tel" value={registrationForm.data.phone} onChange={(event) => registrationForm.setData('phone', event.target.value)} autoComplete="tel" maxLength={30} className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.phone && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.phone}</p>}
                                </div>
                                <div>
                                    <label htmlFor="customer-register-password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                                    <Input id="customer-register-password" type="password" value={registrationForm.data.password} onChange={(event) => registrationForm.setData('password', event.target.value)} autoComplete="new-password" required className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.password && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.password}</p>}
                                </div>
                                <div>
                                    <label htmlFor="customer-register-password-confirmation" className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
                                    <Input id="customer-register-password-confirmation" type="password" value={registrationForm.data.password_confirmation} onChange={(event) => registrationForm.setData('password_confirmation', event.target.value)} autoComplete="new-password" required className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.password_confirmation}</p>}
                                </div>
                                <div>
                                    <label htmlFor="customer-register-address" className="mb-1.5 block text-sm font-medium text-slate-700">Address (optional)</label>
                                    <Textarea id="customer-register-address" value={registrationForm.data.address} onChange={(event) => registrationForm.setData('address', event.target.value)} autoComplete="street-address" maxLength={255} className="border-[#EAE6DE] focus-visible:ring-[#B89B72]" />
                                    {registrationForm.errors.address && <p className="mt-1 text-sm text-red-600">{registrationForm.errors.address}</p>}
                                </div>
                                <DialogFooter className="gap-2 border-t border-[#EAE6DE] pt-4 sm:flex-row">
                                    <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)} className="border-[#EAE6DE] text-[#171717] hover:bg-[#F8F6F2]">Cancel</Button>
                                    <Button type="submit" disabled={registrationForm.processing} className="bg-[#171717] text-white hover:bg-[#333333]">{registrationForm.processing ? 'Creating account...' : 'Create account'}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    {isMenuOpen && (
                        <div className="border-t border-[#EAE6DE] bg-white px-4 py-4 xl:hidden">
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
                                        className="h-10 w-full rounded-lg border border-[#EAE6DE] bg-[#F8F6F2] pl-9 pr-3 text-sm outline-none focus:border-[#B89B72] focus:ring-2 focus:ring-[#B89B72]/20"
                                    />
                                </label>
                            </form>
                            <nav
                                aria-label="Mobile navigation"
                                className="space-y-1"
                            >
                                {renderNavigation(true)}
                                {currentUser && (
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="block rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:text-[#8F744F]"
                                    >
                                        Log out
                                    </Link>
                                )}
                                {isEmployee && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsRegisterOpen(true);
                                        }}
                                        className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-[#8F744F]"
                                    >
                                        Register customer
                                    </button>
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8F744F]">
                                KIC Store
                            </p>
                            <h1 className="mt-1 text-3xl font-semibold text-[#171717]">
                                Clothing, shoes & accessories
                            </h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Browse the collection and find your next
                                favorite.
                            </p>
                        </div>
                        {isEmployee && (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Button
                                    onClick={openCreateProduct}
                                    className="h-11 bg-[#171717] text-white hover:bg-[#333333]"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Product
                                </Button>
                            </div>
                        )}
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
                                className="h-10 w-full rounded-lg border border-[#EAE6DE] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#B89B72] focus:ring-2 focus:ring-[#B89B72]/20"
                            />
                        </label>
                        <Button
                            type="submit"
                            aria-label="Search"
                            className="bg-[#171717] hover:bg-[#333333]"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="mb-4 flex items-center justify-between lg:hidden">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen((open) => !open)}
                            aria-expanded={isSidebarOpen}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#EAE6DE] bg-white px-3 text-sm font-medium text-[#171717] shadow-sm"
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
                            className={`${isSidebarOpen ? 'block' : 'hidden'} space-y-6 rounded-xl border border-[#EAE6DE] bg-white p-4 shadow-[0_8px_24px_rgba(23,23,23,0.035)] lg:sticky lg:top-24 lg:block`}
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
                                                className={`flex w-full items-center justify-between rounded-lg border-l-2 px-3 py-2 text-left text-sm transition ${active ? 'border-[#B89B72] bg-[#F8F6F2] font-semibold text-[#171717]' : 'border-transparent text-slate-600 hover:bg-[#F8F6F2] hover:text-[#171717]'}`}
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
                                        className={`block w-full rounded-lg border-l-2 px-3 py-2 text-left text-sm ${filters.category === '' ? 'border-[#B89B72] bg-[#F8F6F2] font-semibold text-[#171717]' : 'border-transparent text-slate-600 hover:bg-[#F8F6F2]'}`}
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
                                            className={`block w-full rounded-lg border-l-2 px-3 py-2 text-left text-sm ${filters.category === category ? 'border-[#B89B72] bg-[#F8F6F2] font-semibold text-[#171717]' : 'border-transparent text-slate-600 hover:bg-[#F8F6F2]'}`}
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
                                            className="mt-2 h-9 w-full rounded-md border border-[#EAE6DE] bg-white px-2 text-sm focus:border-[#B89B72] focus:outline-none disabled:bg-[#F8F6F2] disabled:text-slate-400"
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
                                            className="mt-2 h-9 w-full rounded-md border border-[#EAE6DE] bg-white px-2 text-sm focus:border-[#B89B72] focus:outline-none disabled:bg-[#F8F6F2] disabled:text-slate-400"
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
                                            className="mt-2 h-9 w-full rounded-md border border-[#EAE6DE] bg-white px-2 text-sm focus:border-[#B89B72] focus:outline-none disabled:bg-[#F8F6F2] disabled:text-slate-400"
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
                                            className="mt-2 h-9 w-full rounded-md border border-[#EAE6DE] bg-white px-2 text-sm focus:border-[#B89B72] focus:outline-none"
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
                                        className="w-full border-[#EAE6DE] text-[#171717] hover:bg-[#F8F6F2]"
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
                                        className="w-full text-center text-xs font-medium text-slate-500 hover:text-[#8F744F]"
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
                            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#EAE6DE] bg-white p-4 shadow-[0_4px_16px_rgba(23,23,23,0.025)] sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2
                                        id="products-heading"
                                        className="text-lg font-semibold text-[#171717]"
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
                                        className="h-9 rounded-md border border-[#EAE6DE] bg-white px-2 font-medium text-[#171717] focus:border-[#B89B72] focus:outline-none"
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
                                                className="group min-w-0 overflow-hidden rounded-xl border border-[#EAE6DE] bg-white shadow-[0_8px_24px_rgba(23,23,23,0.035)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(23,23,23,0.08)]"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDetails(product)
                                                    }
                                                    className="relative block aspect-[4/5] w-full overflow-hidden bg-[#F8F6F2] text-left"
                                                >
                                                    <StoreImage
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        fit="contain"
                                                        className="transition duration-300 group-hover:scale-[1.03]"
                                                    />
                                                    {onSale && (
                                                        <span className="absolute left-3 top-3 rounded-full bg-[#B89B72] px-2.5 py-1 text-xs font-semibold text-white">
                                                            Sale
                                                        </span>
                                                    )}
                                                    {product.stock_quantity ===
                                                        0 && (
                                                        <span className="absolute inset-x-0 bottom-0 bg-[#171717]/80 px-3 py-2 text-center text-xs font-semibold text-white">
                                                            Out of stock
                                                        </span>
                                                    )}
                                                </button>
                                                <div className="p-3 sm:p-4">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8F744F]">
                                                        {product.category}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDetails(product)
                                                        }
                                                        className="mt-1 line-clamp-2 min-h-10 text-left text-sm font-semibold text-[#171717] hover:text-[#8F744F] sm:text-base"
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
                                                            className="min-w-0 border-[#EAE6DE] px-2 text-xs text-[#171717] hover:bg-[#F8F6F2]"
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
                                                            className="min-w-0 bg-[#171717] px-2 text-xs text-white hover:bg-[#333333]"
                                                        >
                                                            <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                                                            Add
                                                        </Button>
                                                    </div>
                                                    {isEmployee && (
                                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                                            <Button
                                                                type="button"
                                                                aria-label={`Edit ${product.name}`}
                                                                title={`Edit ${product.name}`}
                                                                onClick={() =>
                                                                    openEditProduct(
                                                                        product,
                                                                    )
                                                                }
                                                                variant="outline"
                                                                className="h-9 min-h-9 min-w-0 w-full border-blue-200 bg-blue-50 px-2 py-0 text-xs font-semibold text-blue-800 hover:bg-blue-100"
                                                            >
                                                                <Pencil className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                aria-label={`Delete ${product.name}`}
                                                                title={`Delete ${product.name}`}
                                                                onClick={() =>
                                                                    setProductToDelete(
                                                                        product,
                                                                    )
                                                                }
                                                                variant="outline"
                                                                className="h-9 min-h-9 min-w-0 w-full border-red-200 bg-red-50 px-2 py-0 text-xs font-semibold text-red-700 hover:bg-red-100 focus-visible:ring-red-300"
                                                            >
                                                                <Trash2 className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C6AA] bg-white px-6 py-12 text-center shadow-sm">
                                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F6F2] text-[#8F744F]">
                                        <Package className="h-6 w-6" />
                                    </span>
                                    <h3 className="text-base font-semibold text-[#171717]">
                                        No products found
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Add a product to start building your
                                        catalog, or adjust your search and
                                        filters.
                                    </p>
                                    {isEmployee && (
                                        <Button
                                            onClick={openCreateProduct}
                                            className="mt-5 bg-[#171717] hover:bg-[#333333]"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add New Product
                                        </Button>
                                    )}
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
                                                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm ${link.active ? 'border-[#171717] bg-[#171717] font-semibold text-white' : 'border-[#EAE6DE] bg-white text-slate-700 hover:border-[#B89B72] hover:bg-[#F8F6F2]'}`}
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
                                                className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-[#EEEAE2] px-3 text-sm text-slate-300"
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
                    <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-[#EAE6DE] bg-[#F8F6F2] p-0 sm:max-w-2xl">
                        <DialogHeader className="rounded-t-xl bg-[#171717] px-5 py-5 text-left text-white sm:px-6">
                            <DialogTitle className="text-white">
                                {productBeingEdited
                                    ? 'Edit Product'
                                    : 'Add New Product'}
                            </DialogTitle>
                            <DialogDescription className="text-white/70">
                                {productBeingEdited
                                    ? 'Update the product details. Select a new image only if you want to replace the current one.'
                                    : 'Enter product details and upload a product photo.'}
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
                                    Product image{productBeingEdited ? ' (optional replacement)' : ' *'}
                                </label>
                                <input
                                    id="product-image"
                                    type="file"
                                    required={!productBeingEdited}
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
                                    className="block w-full rounded-lg border border-[#EAE6DE] bg-white p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#F8F6F2] file:px-3 file:py-1.5 file:font-semibold file:text-[#171717]"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    JPG, PNG, or WebP. Maximum size 5 MB.
                                </p>
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Selected product preview"
                                        className="mt-3 h-40 w-32 rounded-lg border border-[#EAE6DE] bg-white object-contain p-2"
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
                                    className="bg-[#171717] hover:bg-[#333333]"
                                >
                                                                        {form.processing
                                                                                ? 'Saving…'
                                                                                : productBeingEdited
                                                                                    ? 'Save Changes'
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
                        <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-[#EAE6DE] bg-white p-0 sm:max-w-3xl">
                            <div className="grid md:grid-cols-2">
                                <div className="aspect-[4/5] bg-[#F8F6F2] md:aspect-auto md:min-h-[480px]">
                                    <StoreImage
                                        src={detailProduct.image_url}
                                        alt={detailProduct.name}
                                        fit="contain"
                                        className="p-4"
                                    />
                                </div>
                                <div className="flex flex-col p-5 sm:p-7">
                                    <DialogHeader className="text-left">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#8F744F]">
                                            {detailProduct.category}
                                        </p>
                                        <DialogTitle className="pr-8 text-2xl text-[#171717]">
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
                                                className="mt-2 h-10 w-full rounded-md border border-[#EAE6DE] bg-white px-3 focus:border-[#B89B72] focus:outline-none"
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
                                                className="mt-2 h-10 w-full rounded-md border border-[#EAE6DE] bg-white px-3 focus:border-[#B89B72] focus:outline-none"
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
                                            className="mt-2 h-10 w-24 rounded-md border border-[#EAE6DE] px-3 focus:border-[#B89B72] focus:outline-none"
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
                                        className="mt-auto bg-[#171717] hover:bg-[#333333]"
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
                    <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-[#EAE6DE] bg-white p-0 sm:max-w-xl">
                        <DialogHeader className="bg-[#171717] px-5 py-5 text-left text-white sm:px-6">
                            <DialogTitle className="text-white">
                                Shopping Cart ({cartCount})
                            </DialogTitle>
                            <DialogDescription className="text-white/70">
                                Your cart is saved in this session. Stock and prices are checked when you place the order.
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
                                        className="flex gap-3 border-b border-[#EEEAE2] pb-4"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-24 w-20 rounded-lg bg-[#F8F6F2] object-contain p-1"
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
                                                    className="flex h-7 w-7 items-center justify-center rounded border border-[#EAE6DE] disabled:opacity-40"
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
                                                    className="flex h-7 w-7 items-center justify-center rounded border border-[#EAE6DE] disabled:opacity-40"
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
                                <div className="space-y-4 border-t border-[#EAE6DE] pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-700">Total</span>
                                        <span className="text-lg font-bold text-slate-900">{money(cartTotal)}</span>
                                    </div>
                                    {currentUser ? (
                                        <Button
                                            type="button"
                                            onClick={placeOrder}
                                            className="w-full bg-[#171717] hover:bg-[#333333]"
                                        >
                                            Place Order
                                        </Button>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#171717] text-sm font-semibold text-white transition hover:bg-[#333333]"
                                        >
                                            Log in to place order
                                        </Link>
                                    )}
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
                            <AlertDialogTitle>
                                Delete this product?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                “{productToDelete?.name}” and its stored image
                                will be permanently deleted.
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
