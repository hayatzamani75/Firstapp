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
import { Textarea } from '@/Components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OrderInvoice from '@/Pages/Orders/OrderInvoice';
import type { InvoiceContentSize } from '@/Pages/Orders/OrderInvoice';
import { OrderPageProps, OrderRecord, PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, ClipboardList, FileDown, Printer, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

const money = (amount: string | number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));

function nextStatus(status: OrderRecord['status']): OrderRecord['status'] | null {
    if (status === 'pending') return 'processing';
    if (status === 'processing') return 'shipped';
    if (status === 'shipped') return 'delivered';
    return null;
}

function statusLabel(status: OrderRecord['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function EmployeeReplyForm({ order }: { order: OrderRecord }) {
    const form = useForm({ employee_reply: order.employee_reply ?? '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.patch(route('orders.reply', order.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
            },
        });
    }

    return (
        <form onSubmit={submit} className="border-t border-[#F1EEE8] px-4 py-4 sm:px-5">
            <label htmlFor={`reply-${order.id}`} className="mb-2 block text-sm font-semibold">Reply to customer</label>
            <Textarea
                id={`reply-${order.id}`}
                value={form.data.employee_reply}
                onChange={(event) => form.setData('employee_reply', event.target.value)}
                maxLength={5000}
                placeholder="Write an update or answer for this customer..."
                className="min-h-20 border-[#EAE6DE] bg-white"
            />
            {form.errors.employee_reply && <p className="mt-1 text-sm text-red-600">{form.errors.employee_reply}</p>}
            <div className="mt-3 flex justify-end">
                <Button type="submit" size="sm" disabled={form.processing} className="bg-[#171717] text-white hover:bg-[#333333]">
                    {form.processing ? 'Saving…' : 'Save reply'}
                </Button>
            </div>
        </form>
    );
}

export default function Index() {
    const { orders, isEmployee, orderNotifications } = usePage<
        PageProps<OrderPageProps & Record<string, unknown>>
    >().props;
    const [orderToCancel, setOrderToCancel] = useState<OrderRecord | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<OrderRecord | null>(null);
    const [orderToPrint, setOrderToPrint] = useState<OrderRecord | null>(null);
    const [printScale, setPrintScale] = useState(85);
    const [printMargin, setPrintMargin] = useState(8);
    const [contentSize, setContentSize] = useState<InvoiceContentSize>('compact');

    function printOrder(order: OrderRecord, output: 'pdf' | 'printer') {
        setOrderToPrint(order);
        window.setTimeout(() => {
            const previousTitle = document.title;
            document.title = output === 'pdf' ? `KIC-Invoice-${order.id}` : `KIC-Order-${order.id}`;
            window.print();
            document.title = previousTitle;
            setOrderToPrint(null);
        }, 150);
    }

    function advanceOrder(order: OrderRecord) {
        const status = nextStatus(order.status);
        if (!status) return;

        router.patch(route('orders.status', order.id), { status }, {
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
            },
        });
    }

    function cancelOrder() {
        if (!orderToCancel) return;

        router.patch(route('orders.cancel', orderToCancel.id), {}, {
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
                setOrderToCancel(null);
            },
        });
    }

    function deleteOrder() {
        if (!orderToDelete) return;

        router.delete(route('orders.destroy', orderToDelete.id), {
            preserveScroll: true,
            onSuccess: (response) => {
                const message = response.props.flash.success;
                if (message) MakeToastSuccess(message);
                setOrderToDelete(null);
            },
        });
    }

    return (
        <AuthenticatedLayout hideNavigation hideAccountMenu>
            <Head title="Orders" />
            <div className="no-print min-h-screen bg-[#F8F6F2] text-[#171717]">
                <header className="border-b border-[#EAE6DE] bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href={route('product.view')} className="flex items-center gap-2 font-semibold">
                            <ArrowLeft className="h-4 w-4" /> KIC Store
                        </Link>
                        <span className="text-sm text-slate-500">{isEmployee ? 'Order management' : 'My orders'}</span>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {isEmployee && orderNotifications.length > 0 && (
                        <section className="mb-7 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                            <div className="mb-3 flex items-center gap-2 font-semibold text-amber-950">
                                <Bell className="h-4 w-4" /> New order notifications
                            </div>
                            <div className="space-y-2">
                                {orderNotifications.map((notification) => (
                                    <div key={notification.id} className="flex flex-col gap-2 rounded-lg bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{notification.data.message}</p>
                                            <p className="mt-1 text-xs text-slate-500">{new Date(notification.created_at).toLocaleString()} · {money(notification.data.total)}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.patch(route('notifications.read', notification.id), {}, { preserveScroll: true })}
                                            className="shrink-0 border-amber-300"
                                        >
                                            Mark read
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    <div className="mb-7 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8F744F]">KIC Store</p>
                            <h1 className="mt-1 text-3xl font-semibold">{isEmployee ? 'Customer Orders' : 'My Orders'}</h1>
                        </div>
                        <Link href={route('product.view')} className="hidden text-sm font-medium text-slate-600 hover:text-[#8F744F] sm:block">Continue shopping</Link>
                    </div>

                    {isEmployee && (
                        <section className="no-print mb-6 rounded-xl border border-[#EAE6DE] bg-white p-4 shadow-sm sm:p-5">
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-slate-900">Invoice print settings</h2>
                                <p className="mt-1 text-xs text-slate-500">A4 page · Adjust scale, margins, and content size to fit the invoice. Save as PDF opens the print dialog; select its PDF destination to save a file.</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <label className="text-xs font-medium text-slate-600">
                                    Scale
                                    <select value={printScale} onChange={(event) => setPrintScale(Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-lg border border-[#EAE6DE] bg-white px-3 text-sm text-slate-900 focus:border-[#B89B72] focus:outline-none">
                                        {[70, 75, 80, 85, 90, 95, 100].map((scale) => <option key={scale} value={scale}>{scale}%</option>)}
                                    </select>
                                </label>
                                <label className="text-xs font-medium text-slate-600">
                                    Page margins
                                    <select value={printMargin} onChange={(event) => setPrintMargin(Number(event.target.value))} className="mt-1.5 h-10 w-full rounded-lg border border-[#EAE6DE] bg-white px-3 text-sm text-slate-900 focus:border-[#B89B72] focus:outline-none">
                                        {[5, 8, 10, 12, 16].map((margin) => <option key={margin} value={margin}>{margin} mm</option>)}
                                    </select>
                                </label>
                                <label className="text-xs font-medium text-slate-600">
                                    Content size
                                    <select value={contentSize} onChange={(event) => setContentSize(event.target.value as InvoiceContentSize)} className="mt-1.5 h-10 w-full rounded-lg border border-[#EAE6DE] bg-white px-3 text-sm text-slate-900 focus:border-[#B89B72] focus:outline-none">
                                        <option value="compact">Compact · best fit</option>
                                        <option value="standard">Standard</option>
                                        <option value="large">Large</option>
                                    </select>
                                </label>
                            </div>
                        </section>
                    )}

                    {orders.data.length === 0 ? (
                        <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#EAE6DE] bg-white p-8 text-center shadow-sm">
                            <ClipboardList className="h-8 w-8 text-[#B89B72]" />
                            <h2 className="mt-4 font-semibold">No orders yet</h2>
                            <p className="mt-1 text-sm text-slate-500">Placed orders will appear here.</p>
                            <Link href={route('product.view')} className="mt-5 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#333333]">Browse products</Link>
                        </section>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => {
                                const next = nextStatus(order.status);
                                return (
                                    <article key={order.id} className="overflow-hidden rounded-xl border border-[#EAE6DE] bg-white shadow-sm">
                                        <header className="flex flex-col gap-3 border-b border-[#EEEAE2] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-semibold">Order #{order.id}</h2>
                                                    <span className="rounded-full bg-[#F8F6F2] px-2.5 py-1 text-xs font-medium text-[#8F744F]">{statusLabel(order.status)}</span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</p>
                                                {order.user && <p className="mt-1 text-xs text-slate-500">{order.user.name} · {order.user.email}</p>}
                                            </div>
                                            <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                                                <span className="text-lg font-semibold">{money(order.total)}</span>
                                                {isEmployee && <div className="flex flex-wrap gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => printOrder(order, 'pdf')} className="border-slate-300">
                                                        <FileDown className="mr-2 h-4 w-4" /> Save as PDF
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => printOrder(order, 'printer')} className="border-slate-300">
                                                        <Printer className="mr-2 h-4 w-4" /> Print Directly
                                                    </Button>
                                                </div>}
                                                {isEmployee && next && <Button size="sm" onClick={() => advanceOrder(order)} className="bg-[#171717] text-white hover:bg-[#333333]">Mark {statusLabel(next)}</Button>}
                                                {isEmployee && order.status === 'pending' && <Button size="sm" variant="outline" onClick={() => setOrderToCancel(order)} className="border-red-200 text-red-700 hover:bg-red-50">Cancel order</Button>}
                                                {isEmployee && <Button size="sm" variant="outline" onClick={() => setOrderToDelete(order)} className="border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </Button>}
                                            </div>
                                        </header>
                                        <div className="divide-y divide-[#F1EEE8] px-4 sm:px-5">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="min-w-0">
                                                        <h3 className="truncate text-sm font-medium">{item.product_name}</h3>
                                                        <p className="mt-1 text-xs text-slate-500">{[item.category, item.size, item.color, item.sku].filter(Boolean).join(' · ')}</p>
                                                    </div>
                                                    <p className="shrink-0 text-sm text-slate-600">{item.quantity} × {money(item.unit_price)} <span className="ml-2 font-semibold text-[#171717]">{money(item.line_total)}</span></p>
                                                </div>
                                            ))}
                                        </div>
                                        {isEmployee ? (
                                            <EmployeeReplyForm order={order} />
                                        ) : (
                                            <section className="border-t border-[#F1EEE8] bg-[#FCFBF9] px-4 py-4 sm:px-5">
                                                <h3 className="text-sm font-semibold">Message from the store</h3>
                                                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                                                    {order.employee_reply || 'The store has not replied yet.'}
                                                </p>
                                            </section>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {orders.last_page > 1 && <nav aria-label="Order pagination" className="mt-6 flex flex-wrap justify-center gap-2">{orders.links.map((link, index) => link.url ? <Link key={`${link.label}-${index}`} href={link.url} preserveScroll className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#EAE6DE] bg-white text-slate-700 hover:bg-[#F8F6F2]'}`}>{link.label.replace(/&laquo;|&raquo;/g, '').trim()}</Link> : <span key={`${link.label}-${index}`} className="rounded-lg border border-[#EEEAE2] px-3 py-2 text-sm text-slate-300">{link.label.replace(/&laquo;|&raquo;/g, '').trim()}</span>)}</nav>}
                </main>

                {isEmployee && <AlertDialog open={orderToCancel !== null} onOpenChange={(open) => { if (!open) setOrderToCancel(null); }}>
                    <AlertDialogContent className="w-[calc(100%-2rem)] rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancel order #{orderToCancel?.id}?</AlertDialogTitle>
                            <AlertDialogDescription>Only pending orders can be cancelled. Available inventory will be restored.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Keep order</AlertDialogCancel>
                            <AlertDialogAction onClick={cancelOrder} className="bg-red-600 text-white hover:bg-red-700">Cancel order</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
                {isEmployee && <AlertDialog open={orderToDelete !== null} onOpenChange={(open) => { if (!open) setOrderToDelete(null); }}>
                    <AlertDialogContent className="w-[calc(100%-2rem)] rounded-xl border-red-100">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                                <Trash2 className="h-5 w-5" /> Delete order #{orderToDelete?.id}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This permanently removes the order and its items. If it is still pending, the reserved stock will be restored. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Keep order</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteOrder} className="bg-red-600 text-white hover:bg-red-700">
                                Delete order
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
            </div>
            {orderToPrint && <OrderInvoice order={orderToPrint} contentSize={contentSize} />}
            <style>{`
                @page { size: A4; margin: ${printMargin}mm; }
                @media print {
                    html, body { width: 100%; min-height: 0; margin: 0 !important; background: #fff !important; }
                    .no-print { display: none !important; }
                    body * { visibility: hidden !important; }
                    .invoice-print-root, .invoice-print-root * { visibility: visible !important; }
                    .invoice-print-root { display: block !important; position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; zoom: ${printScale / 100}; box-shadow: none !important; color: #0f172a !important; }
                    .invoice-print-root[data-content-size="compact"] { font-size: 9pt !important; }
                    .invoice-print-root[data-content-size="standard"] { font-size: 10pt !important; }
                    .invoice-print-root[data-content-size="large"] { font-size: 11pt !important; }
                    .invoice-print-root[data-content-size="compact"] [class~="text-xs"] { font-size: 7pt !important; }
                    .invoice-print-root[data-content-size="compact"] [class~="text-sm"] { font-size: 9pt !important; }
                    .invoice-print-root[data-content-size="compact"] [class~="text-base"] { font-size: 10pt !important; }
                    .invoice-print-root[data-content-size="compact"] [class~="text-xl"] { font-size: 14pt !important; }
                    .invoice-print-root[data-content-size="compact"] [class~="text-3xl"] { font-size: 23pt !important; }
                    .invoice-print-root[data-content-size="standard"] [class~="text-xs"] { font-size: 8pt !important; }
                    .invoice-print-root[data-content-size="standard"] [class~="text-sm"] { font-size: 10pt !important; }
                    .invoice-print-root[data-content-size="standard"] [class~="text-base"] { font-size: 11pt !important; }
                    .invoice-print-root[data-content-size="standard"] [class~="text-xl"] { font-size: 16pt !important; }
                    .invoice-print-root[data-content-size="standard"] [class~="text-3xl"] { font-size: 28pt !important; }
                    .invoice-print-root[data-content-size="large"] [class~="text-xs"] { font-size: 9pt !important; }
                    .invoice-print-root[data-content-size="large"] [class~="text-sm"] { font-size: 11pt !important; }
                    .invoice-print-root[data-content-size="large"] [class~="text-base"] { font-size: 12pt !important; }
                    .invoice-print-root[data-content-size="large"] [class~="text-xl"] { font-size: 18pt !important; }
                    .invoice-print-root[data-content-size="large"] [class~="text-3xl"] { font-size: 33pt !important; }
                    .invoice-print-root[data-content-size="compact"] * { line-height: 1.2 !important; }
                    .invoice-print-root[data-content-size="standard"] * { line-height: 1.35 !important; }
                    .invoice-print-root[data-content-size="large"] * { line-height: 1.5 !important; }
                    .invoice-print-root[data-content-size="compact"] .invoice-header { padding-bottom: 10px !important; }
                    .invoice-print-root[data-content-size="compact"] .invoice-customer { padding-top: 10px !important; padding-bottom: 10px !important; }
                    .invoice-print-root[data-content-size="compact"] .invoice-items th,
                    .invoice-print-root[data-content-size="compact"] .invoice-items td { padding-top: 4px !important; padding-bottom: 4px !important; }
                    .invoice-print-root[data-content-size="compact"] .invoice-totals { margin-top: 12px !important; }
                    .invoice-print-root[data-content-size="compact"] .invoice-footer { margin-top: 18px !important; }
                    .invoice-print-root[data-content-size="large"] .invoice-items th,
                    .invoice-print-root[data-content-size="large"] .invoice-items td { padding-top: 12px !important; padding-bottom: 12px !important; }
                    .invoice-print-root .invoice-customer,
                    .invoice-print-root .invoice-totals,
                    .invoice-print-root .invoice-footer,
                    .invoice-print-root tr { break-inside: avoid; page-break-inside: avoid; }
                    .invoice-print-root thead { display: table-header-group; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
