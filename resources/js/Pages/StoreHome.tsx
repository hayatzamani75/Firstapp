import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Headphones, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';

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
    return (
        <>
            <Head title="KIC Store | Everyday style" />
            <div className="min-h-screen bg-[#F8F6F2] text-[#171717]">
                <header className="sticky top-0 z-40 border-b border-[#EAE6DE] bg-white/95 shadow-[0_2px_18px_rgba(23,23,23,0.04)] backdrop-blur">
                    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="KIC Store home">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717] text-white shadow-sm">
                                <ShoppingBag className="h-5 w-5" />
                            </span>
                            <span className="text-lg font-semibold">KIC Store</span>
                        </Link>
                        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
                            <Link href="/" className="text-sm font-medium text-[#8F744F]">Home</Link>
                            <Link href={route('product.view')} className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">All Products</Link>
                            <a href="#collections" className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Collections</a>
                            <a href="#about" className="text-sm font-medium text-slate-700 transition hover:text-[#8F744F]">Our story</a>
                        </nav>
                        <Link href={route('product.view')} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-[#333333]">
                            Shop now <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </header>

                <main>
                    <section className="relative isolate overflow-hidden border-b border-[#EAE6DE] bg-[#f0e9df]">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,rgba(184,155,114,0.32),transparent_42%),linear-gradient(110deg,#f7f3ed_0%,#eee5d9_55%,#e4d6c5_100%)]" />
                        <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
                            <div className="max-w-xl">
                                <p className="inline-flex items-center gap-2 rounded-full border border-[#B89B72]/35 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]"><Sparkles className="h-3.5 w-3.5" /> A fresh point of view</p>
                                <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Good things,<br /><span className="font-normal italic text-[#8F744F]">beautifully chosen.</span></h1>
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

                    <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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

                    <section id="about" className="border-y border-[#EAE6DE] bg-white">
                        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">A little more personal</p>
                                <h2 className="mt-2 text-2xl font-semibold">A store made for finding things you love.</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">Browse the latest collection, place your order, and keep up with updates from our team in one simple place.</p>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600"><Headphones className="h-5 w-5 text-[#8F744F]" /><span>Here to help with your order</span></div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#171717] text-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-9 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                        <Link href="/" className="flex items-center gap-2.5 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><ShoppingBag className="h-4 w-4" /></span>KIC Store</Link>
                        <p className="text-sm text-white/55">Thoughtfully chosen pieces for everyday life.</p>
                        <div className="flex gap-5 text-sm text-white/70"><Link href={route('product.view')} className="transition hover:text-white">Shop</Link><a href="#about" className="transition hover:text-white">About</a><a href="mailto:hello@kicstore.com" className="transition hover:text-white">Contact</a></div>
                    </div>
                    <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">© {new Date().getFullYear()} KIC Store. All rights reserved.</div>
                </footer>
            </div>
        </>
    );
}
