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
import { formatDualPrice } from '@/lib/currency';
import { PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDownToLine,
    ClipboardList,
    Package,
    Plus,
    Search,
    ShoppingCart,
    Truck,
    Wallet,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

type ProductOption = { id: number; name: string; sku: string | null; stock_quantity: number };
type ProcurementStatus = 'draft' | 'ordered' | 'received' | 'cancelled';
type ProcurementRecord = {
    id: number;
    reference: string;
    supplier: string;
    product_id: number | null;
    quantity: number;
    unit_cost: string;
    status: ProcurementStatus;
    expected_date: string | null;
    received_at: string | null;
    notes: string | null;
    created_at: string;
    product: { id: number; name: string; category: string; image_path: string } | null;
    user: { id: number; name: string } | null;
};
type ProcurementPageProps = PageProps<{
    procurements: {
        data: ProcurementRecord[];
        current_page: number;
        last_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    products: ProductOption[];
    filters: { search: string; status: '' | ProcurementStatus };
    stats: { total: number; pending: number; received: number; spend: number };
}>;
type ProcurementFormData = {
    supplier: string;
    product_id: number;
    quantity: string;
    unit_cost: string;
    status: 'draft' | 'ordered' | 'cancelled';
    expected_date: string;
    notes: string;
};

const statusStyles: Record<ProcurementStatus, string> = {
    draft: 'bg-slate-100 text-slate-700',
    ordered: 'bg-blue-50 text-blue-700',
    received: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-rose-50 text-rose-700',
};

function formatStatus(status: ProcurementStatus) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function ProcurementIndex() {
    const { procurements, products, filters, stats } = usePage<ProcurementPageProps>().props;
    const [search, setSearch] = useState(filters.search);
    const [editing, setEditing] = useState<ProcurementRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProcurementRecord | null>(null);
    const [receiveTarget, setReceiveTarget] = useState<ProcurementRecord | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const form = useForm<ProcurementFormData>({
        supplier: '',
        product_id: 0,
        quantity: '1',
        unit_cost: '',
        status: 'draft',
        expected_date: '',
        notes: '',
    });

    function applyFilters(nextSearch = search, status = filters.status) {
        const query: Record<string, string> = {};
        if (nextSearch.trim()) query.search = nextSearch.trim();
        if (status) query.status = status;
        router.get(route('procurement.view'), query, { preserveState: true, preserveScroll: true, replace: true });
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        applyFilters(search);
    }

    function openCreate() {
        setEditing(null);
        form.reset();
        form.setData({ supplier: '', product_id: products[0]?.id ?? 0, quantity: '1', unit_cost: '', status: 'draft', expected_date: '', notes: '' });
        form.clearErrors();
        setFormOpen(true);
    }

    function openEdit(record: ProcurementRecord) {
        setEditing(record);
        form.setData({
            supplier: record.supplier,
            product_id: record.product_id ?? 0,
            quantity: String(record.quantity),
            unit_cost: String(record.unit_cost),
            status: record.status === 'received' ? 'ordered' : record.status,
            expected_date: record.expected_date ?? '',
            notes: record.notes ?? '',
        });
        form.clearErrors();
        setFormOpen(true);
    }

    function submitForm(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setFormOpen(false);
                setEditing(null);
                form.reset();
            },
        };
        if (editing) form.put(route('procurement.update', editing.id), options);
        else form.post(route('procurement.store'), options);
    }

    function deleteRecord() {
        if (!deleteTarget) return;
        router.delete(route('procurement.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function receiveRecord() {
        if (!receiveTarget) return;
        router.patch(route('procurement.receive', receiveTarget.id), {}, {
            preserveScroll: true,
            onSuccess: () => setReceiveTarget(null),
        });
    }

    const statCards = [
        { label: 'Purchase orders', value: stats.total.toLocaleString(), icon: ClipboardList, tone: 'bg-blue-50 text-blue-700' },
        { label: 'Open orders', value: stats.pending.toLocaleString(), icon: Truck, tone: 'bg-amber-50 text-amber-700' },
        { label: 'Received orders', value: stats.received.toLocaleString(), icon: Package, tone: 'bg-emerald-50 text-emerald-700' },
        { label: 'Received spend', value: formatDualPrice(stats.spend), icon: Wallet, tone: 'bg-violet-50 text-violet-700' },
    ];

    return (
        <AuthenticatedLayout header="Procurement">
            <Head title="Procurement" />
            <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
                <div className="mx-auto max-w-7xl space-y-7">
                    <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-9">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.35),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.18),transparent_45%)]" />
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-100"><ShoppingCart className="h-3.5 w-3.5" /> Purchasing operations</span>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Procurement</h1>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Create purchase orders, follow deliveries, and receive goods directly into warehouse stock.</p>
                            </div>
                            <Button type="button" onClick={openCreate} disabled={products.length === 0} className="h-11 bg-white text-slate-950 hover:bg-indigo-50"><Plus className="h-4 w-4" /> New purchase order</Button>
                        </div>
                    </section>

                    <section aria-label="Procurement overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map(({ label, value, icon: Icon, tone }) => <article key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-sm text-slate-500">{label}</span><span className="mt-1 block truncate text-2xl font-bold tracking-tight text-slate-950">{value}</span></span></article>)}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div><h2 className="text-lg font-bold text-slate-950">Purchase orders</h2><p className="mt-1 text-sm text-slate-500">Manage supplier orders and delivery status.</p></div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <form onSubmit={submitSearch} className="flex gap-2">
                                    <label className="relative min-w-0 flex-1 sm:w-64"><span className="sr-only">Search purchase orders</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="PO, supplier or product" className="pl-9" /></label>
                                    <Button type="submit" variant="outline" aria-label="Search procurement"><Search className="h-4 w-4" /></Button>
                                </form>
                                <select aria-label="Filter by order status" value={filters.status} onChange={(event) => applyFilters(search, event.target.value as typeof filters.status)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10">
                                    <option value="">All statuses</option><option value="draft">Draft</option><option value="ordered">Ordered</option><option value="received">Received</option><option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {procurements.data.length > 0 ? <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[980px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3 font-semibold">Order</th><th className="px-4 py-3 font-semibold">Supplier</th><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Expected</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-6 py-3 text-right font-semibold">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-slate-100">{procurements.data.map((record) => <tr key={record.id} className="transition hover:bg-slate-50/70">
                                        <td className="px-6 py-4"><span className="block font-semibold text-slate-900">{record.reference}</span><span className="mt-1 block text-xs text-slate-500">{new Date(record.created_at).toLocaleDateString()}</span></td>
                                        <td className="px-4 py-4 font-medium text-slate-700">{record.supplier}</td>
                                        <td className="px-4 py-4"><span className="block font-medium text-slate-800">{record.product?.name ?? 'Product removed'}</span><span className="mt-1 block text-xs text-slate-500">{record.quantity} units</span></td>
                                        <td className="px-4 py-4 font-semibold text-slate-800">{formatDualPrice(Number(record.unit_cost) * record.quantity)}</td>
                                        <td className="px-4 py-4 text-slate-600">{record.expected_date ? new Date(`${record.expected_date}T00:00:00`).toLocaleDateString() : '—'}</td>
                                        <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>{formatStatus(record.status)}</span></td>
                                        <td className="px-6 py-4"><div className="flex justify-end gap-1.5">{record.status === 'ordered' && <Button type="button" size="sm" onClick={() => setReceiveTarget(record)} className="bg-emerald-600 text-white hover:bg-emerald-700"><ArrowDownToLine className="h-3.5 w-3.5" /> Receive</Button>}{record.status !== 'received' && <><Button type="button" variant="outline" size="sm" onClick={() => openEdit(record)}>Edit</Button><Button type="button" variant="outline" size="sm" onClick={() => setDeleteTarget(record)} className="border-rose-200 text-rose-700 hover:bg-rose-50">Delete</Button></>}</div></td>
                                    </tr>)}</tbody>
                                </table>
                            </div>
                            <div className="divide-y divide-slate-100 md:hidden">{procurements.data.map((record) => <article key={record.id} className="space-y-3 p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold text-slate-950">{record.reference}</p><p className="mt-1 truncate text-sm text-slate-600">{record.supplier}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>{formatStatus(record.status)}</span></div>
                                <div className="rounded-xl bg-slate-50 p-3"><div className="flex justify-between gap-3 text-sm"><span className="truncate font-medium text-slate-800">{record.product?.name ?? 'Product removed'}</span><span className="shrink-0 font-semibold">{record.quantity} units</span></div><div className="mt-2 flex justify-between gap-3 text-xs text-slate-500"><span>{record.expected_date ? `Expected ${new Date(`${record.expected_date}T00:00:00`).toLocaleDateString()}` : 'No delivery date'}</span><span className="font-semibold text-slate-700">{formatDualPrice(Number(record.unit_cost) * record.quantity)}</span></div></div>
                                <div className="grid grid-cols-2 gap-2">{record.status === 'ordered' && <Button type="button" onClick={() => setReceiveTarget(record)} className="col-span-2 bg-emerald-600 text-white hover:bg-emerald-700"><ArrowDownToLine className="h-4 w-4" /> Receive order</Button>}{record.status !== 'received' && <><Button type="button" variant="outline" onClick={() => openEdit(record)}>Edit</Button><Button type="button" variant="outline" onClick={() => setDeleteTarget(record)} className="border-rose-200 text-rose-700 hover:bg-rose-50">Delete</Button></>}</div>
                            </article>)}</div>
                            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="text-sm text-slate-500">Showing {procurements.from ?? 0}–{procurements.to ?? 0} of {procurements.total} orders</p><nav aria-label="Procurement pagination" className="flex flex-wrap gap-1">{procurements.links.map((link, index) => <Link key={`${index}-${link.label}`} href={link.url || '#'} preserveScroll className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm ${link.active ? 'bg-slate-950 font-semibold text-white' : link.url ? 'text-slate-600 hover:bg-slate-100' : 'cursor-not-allowed text-slate-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav></div>
                        </> : <div className="px-6 py-16 text-center"><ClipboardList className="mx-auto h-10 w-10 text-slate-300" /><h3 className="mt-4 font-semibold text-slate-900">No purchase orders yet</h3><p className="mt-1 text-sm text-slate-500">Create an order to start tracking supplier deliveries.</p>{products.length ? <Button type="button" onClick={openCreate} className="mt-4"><Plus className="h-4 w-4" /> Create purchase order</Button> : <Link href={route('product.list')} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Add products first <Package className="h-4 w-4" /></Link>}</div>}
                    </section>
                </div>
            </div>

            <Dialog open={formOpen} onOpenChange={(open) => { setFormOpen(open); if (!open) { setEditing(null); form.reset(); form.clearErrors(); } }}>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl sm:max-w-2xl">
                    <DialogHeader><DialogTitle>{editing ? 'Edit purchase order' : 'Create purchase order'}</DialogTitle><DialogDescription>Enter the supplier, product and delivery details.</DialogDescription></DialogHeader>
                    <form onSubmit={submitForm} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-semibold text-slate-700">Supplier name<Input required maxLength={255} value={form.data.supplier} onChange={(event) => form.setData('supplier', event.target.value)} placeholder="Supplier or vendor" className="mt-2" />{form.errors.supplier && <span className="mt-1 block text-sm text-rose-600">{form.errors.supplier}</span>}</label>
                            <label className="block text-sm font-semibold text-slate-700">Product<select required value={form.data.product_id} onChange={(event) => form.setData('product_id', Number(event.target.value))} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"><option value={0} disabled>Select a product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}{product.sku ? ` · ${product.sku}` : ''} · Stock {product.stock_quantity}</option>)}</select>{form.errors.product_id && <span className="mt-1 block text-sm text-rose-600">{form.errors.product_id}</span>}</label>
                            <label className="block text-sm font-semibold text-slate-700">Quantity<Input type="number" required min="1" max="1000000" value={form.data.quantity} onChange={(event) => form.setData('quantity', event.target.value)} className="mt-2" />{form.errors.quantity && <span className="mt-1 block text-sm text-rose-600">{form.errors.quantity}</span>}</label>
                            <label className="block text-sm font-semibold text-slate-700">Unit cost<Input type="number" required min="0" max="99999999.99" step="0.01" value={form.data.unit_cost} onChange={(event) => form.setData('unit_cost', event.target.value)} placeholder="0.00" className="mt-2" />{form.errors.unit_cost && <span className="mt-1 block text-sm text-rose-600">{form.errors.unit_cost}</span>}</label>
                            <label className="block text-sm font-semibold text-slate-700">Order status<select value={form.data.status} onChange={(event) => form.setData('status', event.target.value as ProcurementFormData['status'])} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"><option value="draft">Draft</option><option value="ordered">Ordered</option><option value="cancelled">Cancelled</option></select>{form.errors.status && <span className="mt-1 block text-sm text-rose-600">{form.errors.status}</span>}</label>
                            <label className="block text-sm font-semibold text-slate-700">Expected delivery<Input type="date" value={form.data.expected_date} onChange={(event) => form.setData('expected_date', event.target.value)} className="mt-2" />{form.errors.expected_date && <span className="mt-1 block text-sm text-rose-600">{form.errors.expected_date}</span>}</label>
                        </div>
                        <label className="block text-sm font-semibold text-slate-700">Notes <span className="font-normal text-slate-400">(optional)</span><Textarea maxLength={2000} value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} placeholder="Delivery instructions or order details" className="mt-2 min-h-24" />{form.errors.notes && <span className="mt-1 block text-sm text-rose-600">{form.errors.notes}</span>}</label>
                        <DialogFooter className="gap-2 border-t border-slate-100 pt-4 sm:flex-row"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit" disabled={form.processing}>{form.processing ? 'Saving...' : editing ? 'Save changes' : 'Create order'}</Button></DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl"><AlertDialogHeader><AlertDialogTitle>Delete this purchase order?</AlertDialogTitle><AlertDialogDescription>{deleteTarget?.reference} will be permanently deleted. Received orders are locked.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={deleteRecord} className="bg-rose-600 text-white hover:bg-rose-700">Delete order</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={receiveTarget !== null} onOpenChange={(open) => { if (!open) setReceiveTarget(null); }}>
                <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl"><AlertDialogHeader><AlertDialogTitle>Receive this order?</AlertDialogTitle><AlertDialogDescription>{receiveTarget?.quantity} units of {receiveTarget?.product?.name} will be added to warehouse stock and logged as an incoming stock movement.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={receiveRecord} className="bg-emerald-600 text-white hover:bg-emerald-700">Receive goods</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
