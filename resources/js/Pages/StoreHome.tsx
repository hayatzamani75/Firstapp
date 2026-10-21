import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowRight, BadgeCheck, Headphones, Menu, PackageCheck, ShoppingBag, Sparkles, Tags, Warehouse as WarehouseIcon, X } from 'lucide-react';
import { useState } from 'react';

const collections = [
    {
        title: 'Everyday essentials',
        description: 'Easy pieces made for the rhythm of every day.',
        label: 'Explore the collection',
        tone: 'from-[#e7d6bf] via-[#f3e9dc] to-[#d9c2a3]',
        mark: '01',
    },
    {
        title: 'Modern classics',
        description: 'Timeless shapes, thoughtful details, lasting style.',
        label: 'Find your favorites',
        tone: 'from-[#d6d8d1] via-[#ecece5] to-[#c3c8bc]',
        mark: '02',
    },
    {
        title: 'Made to move',
        description: 'Comfortable footwear for wherever the day goes.',
        label: 'Shop footwear',
        tone: 'from-[#d8c8c0] via-[#f0e6df] to-[#c8aea2]',
        mark: '03',
    },
];

export default function StoreHome() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { categories, auth } = usePage<PageProps<{
        categories: { name: string; products_count: number }[];
    }>>().props;
    const canManageWarehouse = auth.user?.role === 'employee' || auth.user?.role === 'manager';

    return (
        <>
            <Head title="KIC Store | Everyday style" />
            <div className="min-h-screen bg-[#F8F6F2] text-[#171717]">
                <header className="sticky top-0 z-40 border-b border-[#EAE6DE] bg-white/95 shadow-[0_2px_18px_rgba(23,23,23,0.04)] backdrop-blur">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-3 sm:gap-6 sm:px-6 lg:px-8">
                        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="KIC Store home">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717] text-white shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </span>
                            <span className="text-lg font-semibold">KIC Store</span>
                        </Link>
                        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
                            <Link href="/" className="text-sm font-medium text-[#8F744F]">Home</Link>
                            <Link href={route('product.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">All Products</Link>
                            <Link href={route('product.list')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Product List</Link>
                            <Link href={route('categories.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Categories</Link>
                            {canManageWarehouse && <Link href={route('warehouse.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Warehouse</Link>}
                            {canManageWarehouse && <Link href={route('procurement.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Procurement</Link>}
                            <a href="#collections" className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Collections</a>
                            <a href="#about" className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Our story</a>
                        </nav>
                        <div className="flex shrink-0 items-center gap-2">
                            {canManageWarehouse && <Link href={route('warehouse.view')} aria-label="Open warehouse" title="Warehouse" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-800 transition hover:bg-sky-100 md:hidden"><WarehouseIcon className="h-4 w-4" /></Link>}
                            <Link href={route('dashboard')} aria-label="Open admin panel" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-[#D8E1F0] bg-blue-50 px-2.5 text-xs font-bold text-blue-800 transition hover:border-blue-300 hover:bg-blue-100 sm:px-4 sm:text-sm">
                                <span className="sm:hidden">Admin</span>
                                <span className="hidden sm:inline">Admin panel</span>
                            </Link>
                            <Link href={route('product.view')} aria-label="Shop now" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#171717] px-2.5 text-sm font-semibold text-white transition hover:bg-[#333333] sm:gap-2 sm:px-4">
                                <span className="hidden sm:inline">Shop now</span><ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between lg:hidden">
                        <button
                            type="button"
                            aria-expanded={isSidebarOpen}
                            aria-controls="store-home-sidebar"
                            onClick={() => setIsSidebarOpen((open) => !open)}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#E3D5C1] bg-white px-3 text-sm font-medium text-[#5B4529] shadow-sm transition hover:bg-[#F3EBDD]"
                        >
                            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            {isSidebarOpen ? 'Close menu' : 'Browse store'}
                        </button>
                        <span className="text-xs font-medium text-slate-500">Discover KIC Store</span>
                    </div>
                    <div className="grid items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-6">
                    <aside id="store-home-sidebar" className={`${isSidebarOpen ? 'block' : 'hidden'} rounded-2xl border border-[#E3D5C1] bg-gradient-to-br from-[#F1E8DB] via-[#FAF7F1] to-[#F3EBDD] p-4 shadow-[0_12px_32px_rgba(95,72,43,0.10)] lg:sticky lg:top-24 lg:block`}>
                        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8F744F]">Discover</p>
                        <nav aria-label="Store sections" className="space-y-1">
                            <a href="#home" className="flex items-center justify-between rounded-lg border-l-2 border-[#8F744F] bg-white/80 px-3 py-2.5 text-sm font-semibold text-[#5B4529] shadow-sm">Home <span className="text-xs text-[#8F744F]">01</span></a>
                            <Link href={route('product.view')} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">All products</Link>
                            <Link href={route('product.list')} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">Product List</Link>
                            <Link href={route('categories.view')} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">Categories</Link>
                            {canManageWarehouse && <Link href={route('warehouse.view')} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">Warehouse</Link>}
                            {canManageWarehouse && <Link href={route('procurement.view')} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">Procurement</Link>}
                            <a href="#collections" className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">Collections</a>
                            <Link href={route('product.view', { collection: 'new' })} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">New arrivals</Link>
                            <Link href={route('product.view', { collection: 'sale' })} className="block rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">On sale</Link>
                        </nav>
                        <div className="my-5 border-t border-[#E3D5C1]" />
                        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8F744F]">Shop by category</p>
                        <nav aria-label="Product categories" className="space-y-1">
                            {categories.slice(0, 8).map((category) => (
                                <Link key={category.name} href={route('product.view', { category: category.name })} className="block rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-slate-600 transition hover:bg-white/60 hover:text-[#5B4529]">{category.name}</Link>
                            ))}
                            {categories.length === 0 && <p className="px-3 py-2 text-sm text-slate-500">Categories will appear as products are added.</p>}
                            <Link href={route('categories.view')} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#8F744F] transition hover:bg-white/60"><Tags className="h-4 w-4" /> Browse all categories</Link>
                        </nav>
                        <div className="mt-6 rounded-xl bg-[#171717] p-4 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D8BD98]">The KIC edit</p>
                            <p className="mt-2 text-sm font-medium leading-5">Thoughtful pieces for everyday life.</p>
                            <Link href={route('product.view')} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#E6D1B4] hover:text-white">Explore the store <ArrowRight className="h-3.5 w-3.5" /></Link>
                        </div>
                    </aside>

                    <div className="min-w-0">
                    <section id="home" className="relative isolate overflow-hidden rounded-2xl border border-[#E3D5C1] bg-[#f0e9df] shadow-sm sm:rounded-3xl">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,rgba(184,155,114,0.32),transparent_42%),linear-gradient(110deg,#f7f3ed_0%,#eee5d9_55%,#e4d6c5_100%)]" />
                        <div className="grid min-h-[420px] items-center gap-8 px-5 py-10 sm:min-h-[500px] sm:gap-10 sm:px-10 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
                            <div className="max-w-xl">
                                <p className="inline-flex items-center gap-2 rounded-full border border-[#B89B72]/35 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]"><Sparkles className="h-3.5 w-3.5" /> A fresh point of view</p>
                                <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Good things,<br /><span className="font-normal italic text-[#8F744F]">beautifully chosen.</span></h1>
                                <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">Discover clothing, shoes, and accessories selected for everyday comfort and effortless style. Find pieces you’ll reach for again and again.</p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link href={route('product.view')} className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#171717] px-6 text-sm font-semibold text-white transition hover:bg-[#333333]">Explore all products <ArrowRight className="h-4 w-4" /></Link>
                                    <a href="#collections" className="inline-flex h-12 items-center rounded-lg border border-[#D7C8B5] bg-white/70 px-6 text-sm font-semibold text-[#171717] transition hover:bg-white">Browse collections</a>
                                </div>
                                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-600">
                                    <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#8F744F]" /> Thoughtfully selected</span>
                                    <span className="inline-flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#8F744F]" /> Easy order tracking</span>
                                </div>
                            </div>
                            <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
                                <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full border border-white/60" />
                                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-[#c9aa86] via-[#eee1d0] to-[#9c8061] p-5 shadow-[0_28px_70px_rgba(83,64,42,0.18)] sm:p-7">
                                    <div className="absolute inset-5 rounded-[1.5rem] border border-white/50 sm:inset-7" />
                                    <div className="absolute left-[16%] top-[12%] h-[76%] w-[40%] -rotate-6 rounded-t-[48%] rounded-b-[18%] bg-gradient-to-br from-[#faf7f0] via-[#ded0bd] to-[#a88c6a] shadow-[18px_20px_38px_rgba(67,48,29,0.18)]" />
                                    <div className="absolute right-[12%] top-[20%] h-[62%] w-[35%] rotate-[8deg] rounded-[45%_45%_18%_18%] bg-gradient-to-br from-[#8d7865] via-[#6e5a49] to-[#3b332d] shadow-[12px_18px_30px_rgba(48,38,29,0.2)]" />
                                    <div className="absolute bottom-9 left-9 rounded-lg bg-white/75 px-4 py-3 backdrop-blur sm:bottom-12 sm:left-12">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8F744F]">The new edit</p>
                                        <p className="mt-1 text-sm font-semibold">Made for your every day</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="categories" className="py-10 sm:py-12">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">Browse your way</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Shop by category</h2>
                            </div>
                            <Link href={route('categories.view')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#8F744F] transition hover:text-[#6f593a]">View all categories <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        {categories.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {categories.slice(0, 8).map((category, index) => (
                                    <Link key={category.name} href={route('product.view', { category: category.name })} className="group flex items-center gap-4 rounded-2xl border border-[#EAE6DE] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D8C6AA] hover:shadow-md">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F1E8DB] to-[#E4D6C5] text-sm font-bold text-[#8F744F]">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate font-semibold text-[#171717]">{category.name}</span>
                                            <span className="mt-1 block text-xs text-slate-500">{category.products_count} {category.products_count === 1 ? 'product' : 'products'}</span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-[#B89B72] transition group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-[#D8C6AA] bg-white px-6 py-10 text-center text-sm text-slate-500">Categories will appear here as products are added.</div>
                        )}
                    </section>

                    <section id="collections" className="py-12 sm:py-16">
                        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">Find your next favorite</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight">Shop the collections</h2>
                            </div>
                            <Link href={route('product.view')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#8F744F] transition hover:text-[#6f593a]">View all products <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {collections.map((collection) => (
                                <Link key={collection.title} href={route('product.view')} className="group overflow-hidden rounded-2xl border border-[#EAE6DE] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                    <div className={`relative aspect-[1.35] overflow-hidden bg-gradient-to-br ${collection.tone}`}>
                                        <span className="absolute -bottom-12 -right-3 text-[9rem] font-semibold leading-none text-white/35 transition duration-500 group-hover:scale-110">{collection.mark}</span>
                                        <span className="absolute left-5 top-5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6f593a]">KIC edit</span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-semibold">{collection.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">{collection.description}</p>
                                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8F744F]">{collection.label}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section id="about" className="rounded-2xl border border-[#EAE6DE] bg-white">
                        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">A little more personal</p>
                                <h2 className="mt-2 text-2xl font-semibold">A store made for finding things you love.</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">Browse the latest collection, place your order, and keep up with updates from our team in one simple place.</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600"><Headphones className="h-5 w-5 text-[#8F744F]" /><span>Here to help with your order</span></div>
                        </div>
                    </section>
                    </div>
                    </div>
                </main>

                <footer className="bg-[#171717] text-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                        <Link href="/" className="flex items-center gap-2.5 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><ShoppingBag className="h-4 w-4" /></span>KIC Store</Link>
                        <p className="text-sm text-white/55">Thoughtfully chosen pieces for everyday life.</p>
                        <div className="flex gap-5 text-sm text-white/70"><Link href={route('product.view')} className="transition hover:text-white">Shop</Link><Link href={route('product.list')} className="transition hover:text-white">Product List</Link><Link href={route('categories.view')} className="transition hover:text-white">Categories</Link><a href="#about" className="transition hover:text-white">About</a><a href="mailto:hello@kicstore.com" className="transition hover:text-white">Contact</a></div>
                    </div>
                    <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">© {new Date().getFullYear()} KIC Store. All rights reserved.</div>
                </footer>
            </div>
        </>
    );
}
