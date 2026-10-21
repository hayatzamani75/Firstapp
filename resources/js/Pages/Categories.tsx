import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight, ShoppingBag, Tags, Warehouse as WarehouseIcon } from 'lucide-react';

type Category = {
    name: string;
    products_count: number;
    image_url: string | null;
};

export default function Categories() {
    const { categories, auth } = usePage<PageProps<{
        categories: Category[];
    }>>().props;
    const canManageWarehouse = auth.user?.role === 'employee' || auth.user?.role === 'manager';

    return (
        <AuthenticatedLayout hideNavigation hideAccountMenu>
            <Head title="Categories" />
            <div className="min-h-screen bg-[#F8F6F2] text-[#171717]">
                <header className="sticky top-0 z-40 border-b border-[#EAE6DE] bg-white/95 shadow-[0_2px_18px_rgba(23,23,23,0.04)] backdrop-blur">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="KIC Store home">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717] text-white shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </span>
                            <span className="text-lg font-semibold">KIC Store</span>
                        </Link>
                        <nav aria-label="Store navigation" className="hidden items-center gap-6 md:flex">
                            <Link href="/" className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Home</Link>
                            <Link href={route('product.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">All products</Link>
                            <Link href={route('product.list')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Product List</Link>
                            <Link href={route('categories.view')} aria-current="page" className="text-sm font-semibold text-[#8F744F]">Categories</Link>
                            {canManageWarehouse && <Link href={route('warehouse.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Warehouse</Link>}
                            {canManageWarehouse && <Link href={route('procurement.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Procurement</Link>}
                        </nav>
                        <div className="flex shrink-0 items-center gap-2">
                            {canManageWarehouse && <Link href={route('warehouse.view')} aria-label="Open warehouse" title="Warehouse" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-800 transition hover:bg-sky-100 md:hidden"><WarehouseIcon className="h-4 w-4" /></Link>}
                            <Link href={route('product.view')} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#171717] px-3 text-sm font-semibold text-white transition hover:bg-[#333333] sm:px-4">
                                Shop now <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <section className="relative isolate overflow-hidden rounded-3xl border border-[#E3D5C1] bg-[#f0e9df] px-6 py-9 shadow-sm sm:px-10 sm:py-12">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_15%,rgba(184,155,114,0.32),transparent_42%),linear-gradient(110deg,#f7f3ed_0%,#eee5d9_55%,#e4d6c5_100%)]" />
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#B89B72]/35 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">
                                <Tags className="h-3.5 w-3.5" /> Browse by category
                            </span>
                            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">Find your kind of favorite.</h1>
                            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                                Explore the KIC collection by category and find the pieces that fit your everyday style.
                            </p>
                        </div>
                    </section>

                    <section className="py-10 sm:py-12" aria-labelledby="category-list-heading">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">The KIC edit</p>
                                <h2 id="category-list-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Shop all categories</h2>
                            </div>
                            <p className="text-sm text-slate-500">{categories.length} {categories.length === 1 ? 'category' : 'categories'} to explore</p>
                        </div>

                        {categories.length > 0 ? (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                {categories.map((category, index) => (
                                    <Link
                                        key={category.name}
                                        href={route('product.view', { category: category.name })}
                                        className="group overflow-hidden rounded-2xl border border-[#EAE6DE] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D8C6AA] hover:shadow-[0_18px_38px_rgba(83,64,42,0.12)]"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F1E8DB] via-[#FAF7F1] to-[#D9C2A3]">
                                            {category.image_url ? (
                                                <img src={category.image_url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-[#B89B72]"><Tags className="h-12 w-12" /></div>
                                            )}
                                            <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f593a] backdrop-blur">Category {String(index + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-5">
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-lg font-semibold text-[#171717]">{category.name}</span>
                                                <span className="mt-1 block text-sm text-slate-500">{category.products_count} {category.products_count === 1 ? 'product' : 'products'}</span>
                                            </span>
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F6F2] text-[#8F744F] transition group-hover:bg-[#171717] group-hover:text-white">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[#D8C6AA] bg-white px-6 py-16 text-center">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F6F2] text-[#8F744F]"><Tags className="h-6 w-6" /></span>
                                <h3 className="mt-4 text-lg font-semibold">Categories are coming soon</h3>
                                <p className="mt-2 text-sm text-slate-500">Categories will appear here when products are added to the store.</p>
                                <Link href={route('product.view')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8F744F] hover:text-[#6f593a]">Browse all products <ArrowRight className="h-4 w-4" /></Link>
                            </div>
                        )}
                    </section>
                </main>

                <footer className="border-t border-[#EAE6DE] bg-white py-6 text-center text-xs text-slate-500">
                    KIC Store · Thoughtfully chosen for everyday life
                </footer>
            </div>
        </AuthenticatedLayout>
    );
}
