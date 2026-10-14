import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Menu, Package, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: route('product.view') },
    { label: 'Categories', href: '#categories' },
    { label: 'New Arrivals' },
    { label: 'Contact Us' },
];

export default function Product() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const renderNavigation = (mobile = false) =>
        navigationItems.map((item) => {
            const className = mobile
                ? 'block rounded-md px-3 py-2 text-sm font-medium'
                : 'whitespace-nowrap text-sm font-medium';
            const activeClass = item.href
                ? 'text-slate-700 transition hover:text-blue-700'
                : 'cursor-not-allowed text-slate-400';

            if (!item.href) {
                return (
                    <span key={item.label} aria-disabled="true" className={`${className} ${activeClass}`}>
                        {item.label}
                    </span>
                );
            }

            const onClick = mobile ? () => setIsMenuOpen(false) : undefined;
            const linkClass = `${className} ${activeClass}`;

            if (item.href.startsWith('#')) {
                return (
                    <a key={item.label} href={item.href} onClick={onClick} className={linkClass}>
                        {item.label}
                    </a>
                );
            }

            return (
                <Link key={item.label} href={item.href} onClick={onClick} className={linkClass}>
                    {item.label}
                </Link>
            );
        });

    return (
        <AuthenticatedLayout
            hideNavigation
            hideAccountMenu
        >
            <Head title="Product" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <header className="sticky top-0 z-40 border-b border-blue-100 bg-white shadow-sm">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
                        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="KIC Store home">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </span>
                            <span className="text-lg font-bold text-slate-900">KIC Store</span>
                        </Link>

                        <nav aria-label="Main navigation" className="hidden flex-1 items-center justify-center gap-6 lg:flex">
                            {renderNavigation()}
                        </nav>

                        <div className="ml-auto hidden w-full max-w-xs md:block">
                            <label className="relative block">
                                <span className="sr-only">Search products</span>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Search products"
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                        </div>

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
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
                            <label className="relative mb-3 block">
                                <span className="sr-only">Search products</span>
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Search products"
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <nav aria-label="Mobile navigation" className="space-y-1">
                                {renderNavigation(true)}
                            </nav>
                        </div>
                    )}
                </header>

                <main>
                    <section id="categories" aria-labelledby="categories-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        <div className="mb-7">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Browse the store</p>
                            <h1 id="categories-heading" className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                                Shop by Category
                            </h1>
                        </div>

                        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white px-6 py-12 text-center shadow-sm">
                            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <Package className="h-6 w-6" />
                            </span>
                            <h2 className="text-base font-semibold text-slate-800">No categories available</h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Categories will appear here when category data is available.
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}