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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Product } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ArrowRight,
    ArrowUpFromLine,
    Boxes,
    CircleAlert,
    History,
    Package,
    Search,
    Warehouse as WarehouseIcon,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

type WarehouseProps = PageProps<{
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search: string; stock: '' | 'low' | 'out' };
    stats: { products: number; units: number; low_stock: number; out_of_stock: number };
    movements: {
        id: number;
        type: 'in' | 'out';
        quantity: number;
        stock_before: number;
        stock_after: number;
        reason: string | null;
        created_at: string;
        product: { id: number; name: string; category: string };
        user: { id: number; name: string } | null;
    }[];
    lowStockThreshold: number;
}>;

type MovementData = {
    product_id: number;
    type: 'in' | 'out';
    quantity: string;
    reason: string;
};

export default function WarehouseIndex() {
    const { products, filters, stats, movements, lowStockThreshold } =
        usePage<WarehouseProps>().props;
    const [search, setSearch] = useState(filters.search);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [movementType, setMovementType] = useState<'in' | 'out'>('in');
    const form = useForm<MovementData>({
        product_id: 0,
        type: 'in',
        quantity: '1',
        reason: '',
    });

    function applyFilters(next: Partial<typeof filters>) {
        const values = { ...filters, search, ...next };
        const query: Record<string, string> = {};
        if (values.search) query.search = values.search;
        if (values.stock) query.stock = values.stock;
        router.get(route('warehouse.view'), query, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        applyFilters({ search });
    }

    function openMovement(product: Product, type: 'in' | 'out') {
        setSelectedProduct(product);
        setMovementType(type);
        form.setData({ product_id: product.id, type, quantity: '1', reason: '' });
        form.clearErrors();
    }

    function submitMovement(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(route('warehouse.movements.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setSelectedProduct(null);
            },
        });
    }

    function closeMovement(open: boolean) {
        if (!open) {
            setSelectedProduct(null);
            form.reset();
            form.clearErrors();
        }
    }

    const statCards = [
        { label: 'Products tracked', value: stats.products, icon: Package, tone: 'bg-blue-50 text-blue-700', filter: '' as const },
        { label: 'Units on hand', value: stats.units.toLocaleString(), icon: Boxes, tone: 'bg-violet-50 text-violet-700', filter: '' as const },
        { label: 'Low stock', value: stats.low_stock, icon: CircleAlert, tone: 'bg-amber-50 text-amber-700', filter: 'low' as const },
        { label: 'Out of stock', value: stats.out_of_stock, icon: ArrowUpFromLine, tone: 'bg-rose-50 text-rose-700', filter: 'out' as const },
    ];

    return (
        <AuthenticatedLayout header="Warehouse">
            <Head title="Warehouse" />
            <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
                <div className="mx-auto max-w-7xl space-y-7">
                    <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-9">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.35),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.2),transparent_45%)]" />
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100"><WarehouseIcon className="h-3.5 w-3.5" /> Inventory operations</span>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Warehouse</h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Track stock levels and record every delivery or issue in one place.</p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                                <span className="block text-xs text-slate-400">Low stock threshold</span>
                                <span className="mt-1 block font-semibold">{lowStockThreshold} units or fewer</span>
                            </div>
                        </div>
                    </section>

                    <section aria-label="Inventory overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map(({ label, value, icon: Icon, tone, filter }) => (
                            <button key={label} type="button" onClick={() => applyFilters({ stock: filter })} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
                                <span><span className="block text-sm text-slate-500">{label}</span><span className="mt-1 block text-2xl font-bold tracking-tight text-slate-950">{value}</span></span>
                            </button>
                        ))}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-950">Inventory</h2>
                                <p className="mt-1 text-sm text-slate-500">Search products and update stock levels.</p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <form onSubmit={submitSearch} className="flex gap-2">
                                    <label className="relative min-w-0 flex-1 sm:w-64">
                                        <span className="sr-only">Search inventory</span>
                                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Product, SKU or category" className="pl-9" />
                                    </label>
                                    <Button type="submit" variant="outline" aria-label="Search inventory"><Search className="h-4 w-4" /></Button>
                                </form>
                                <select aria-label="Filter stock level" value={filters.stock} onChange={(event) => applyFilters({ stock: event.target.value as typeof filters.stock })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10">
                                    <option value="">All stock</option>
                                    <option value="low">Low stock</option>
                                    <option value="out">Out of stock</option>
                                </select>
                            </div>
                        </div>

                        {products.data.length ? (
                            <>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[760px] text-left text-sm">
                                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                            <tr><th className="px-6 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">SKU</th><th className="px-4 py-3 font-semibold">Stock level</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-6 py-3 text-right font-semibold">Actions</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {products.data.map((product) => {
                                                const isOut = product.stock_quantity === 0;
                                                const isLow = product.stock_quantity <= lowStockThreshold;
                                                return (
                                                    <tr key={product.id} className="transition hover:bg-slate-50/70">
                                                        <td className="px-6 py-4"><div className="flex min-w-0 items-center gap-3"><img src={product.image_url} alt="" className="h-12 w-12 rounded-xl bg-slate-100 object-contain p-1" /><span className="min-w-0"><span className="block truncate font-semibold text-slate-900">{product.name}</span><span className="mt-1 block text-xs text-slate-500">{product.category}</span></span></div></td>
                                                        <td className="px-4 py-4 text-slate-500">{product.sku || '—'}</td>
                                                        <td className="px-4 py-4"><span className="font-bold tabular-nums text-slate-900">{product.stock_quantity}</span><span className="ml-1 text-xs text-slate-500">units</span></td>
                                                        <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isOut ? 'bg-rose-50 text-rose-700' : isLow ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{isOut ? 'Out of stock' : isLow ? 'Low stock' : 'In stock'}</span></td>
                                                        <td className="px-6 py-4"><div className="flex justify-end gap-2"><Button type="button" variant="outline" size="sm" onClick={() => openMovement(product, 'in')} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"><ArrowDownToLine className="h-3.5 w-3.5" /> Receive</Button><Button type="button" variant="outline" size="sm" disabled={isOut} onClick={() => openMovement(product, 'out')} className="border-rose-200 text-rose-700 hover:bg-rose-50"><ArrowUpFromLine className="h-3.5 w-3.5" /> Issue</Button></div></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="divide-y divide-slate-100 md:hidden">
                                    {products.data.map((product) => {
                                        const isOut = product.stock_quantity === 0;
                                        const isLow = product.stock_quantity <= lowStockThreshold;
                                        return (
                                            <article key={product.id} className="p-4 sm:p-5">
                                                <div className="flex gap-3">
                                                    <img src={product.image_url} alt="" className="h-14 w-14 shrink-0 rounded-xl bg-slate-100 object-contain p-1" />
                                                    <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="truncate font-semibold text-slate-900">{product.name}</h3><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${isOut ? 'bg-rose-50 text-rose-700' : isLow ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{isOut ? 'Out' : isLow ? 'Low' : 'In stock'}</span></div><p className="mt-1 truncate text-xs text-slate-500">{product.category}{product.sku ? ` · ${product.sku}` : ''}</p><p className="mt-2 text-sm font-bold text-slate-800">{product.stock_quantity} <span className="font-normal text-slate-500">units</span></p></div>
                                                </div>
                                                <div className="mt-4 grid grid-cols-2 gap-2"><Button type="button" variant="outline" onClick={() => openMovement(product, 'in')} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"><ArrowDownToLine className="h-4 w-4" /> Receive</Button><Button type="button" variant="outline" disabled={isOut} onClick={() => openMovement(product, 'out')} className="border-rose-200 text-rose-700 hover:bg-rose-50"><ArrowUpFromLine className="h-4 w-4" /> Issue</Button></div>
                                            </article>
                                        );
                                    })}
                                </div>
                                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <p className="text-sm text-slate-500">Showing {products.from ?? 0}–{products.to ?? 0} of {products.total} products</p>
                                    <nav aria-label="Inventory pagination" className="flex flex-wrap gap-1">
                                        {products.links.map((link, index) => (
                                            <Link key={`${index}-${link.label}`} href={link.url || '#'} preserveScroll className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm ${link.active ? 'bg-slate-950 font-semibold text-white' : link.url ? 'text-slate-600 hover:bg-slate-100' : 'cursor-not-allowed text-slate-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ))}
                                    </nav>
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-16 text-center"><Package className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-4 font-semibold text-slate-900">No inventory found</h3><p className="mt-1 text-sm text-slate-500">Add a product or clear the current filters.</p><Link href={route('product.list')} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">Open product list <ArrowRight className="h-4 w-4" /></Link></div>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><History className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-950">Recent stock movements</h2><p className="mt-0.5 text-sm text-slate-500">Latest receipts and issues recorded by your team.</p></div></div>
                        {movements.length ? <div className="divide-y divide-slate-100">{movements.map((movement) => <article key={movement.id} className="flex items-center gap-3 px-5 py-4 sm:px-6"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${movement.type === 'in' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{movement.type === 'in' ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{movement.product.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{movement.reason || (movement.type === 'in' ? 'Stock received' : 'Stock issued')} · {movement.user?.name || 'Former user'} · {new Date(movement.created_at).toLocaleString()}</p></div><div className="shrink-0 text-right"><p className={`text-sm font-bold tabular-nums ${movement.type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>{movement.type === 'in' ? '+' : '−'}{movement.quantity}</p><p className="text-[11px] text-slate-500">{movement.stock_before} → {movement.stock_after}</p></div></article>)}</div> : <p className="px-6 py-10 text-center text-sm text-slate-500">No stock movements recorded yet.</p>}
                    </section>
                </div>
            </div>

            <Dialog open={selectedProduct !== null} onOpenChange={closeMovement}>
                <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{movementType === 'in' ? 'Receive stock' : 'Issue stock'}</DialogTitle>
                        <DialogDescription>{selectedProduct?.name} · Current stock: {selectedProduct?.stock_quantity ?? 0} units</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitMovement} className="space-y-4">
                        <input type="hidden" value={form.data.product_id} />
                        <input type="hidden" value={form.data.type} />
                        <label className="block text-sm font-semibold text-slate-700">Quantity
                            <Input type="number" min="1" max="1000000" required value={form.data.quantity} onChange={(event) => form.setData('quantity', event.target.value)} className="mt-2" />
                            {form.errors.quantity && <span className="mt-1 block text-sm font-medium text-rose-600">{form.errors.quantity}</span>}
                        </label>
                        <label className="block text-sm font-semibold text-slate-700">Reason <span className="font-normal text-slate-400">(optional)</span>
                            <Input value={form.data.reason} maxLength={255} onChange={(event) => form.setData('reason', event.target.value)} placeholder={movementType === 'in' ? 'Supplier delivery, return...' : 'Sale, damaged item, transfer...'} className="mt-2" />
                            {form.errors.reason && <span className="mt-1 block text-sm font-medium text-rose-600">{form.errors.reason}</span>}
                        </label>
                        <DialogFooter className="gap-2 pt-2 sm:gap-2">
                            <Button type="button" variant="outline" onClick={() => closeMovement(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.processing} className={movementType === 'in' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-600 text-white hover:bg-rose-700'}>{form.processing ? 'Saving...' : movementType === 'in' ? 'Confirm receipt' : 'Confirm issue'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
