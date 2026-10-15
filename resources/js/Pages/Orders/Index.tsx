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
import { OrderPageProps, OrderRecord, PageProps } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Bell, ClipboardList } from 'lucide-react';
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

    return (
        <AuthenticatedLayout hideNavigation hideAccountMenu>
            <Head title="Orders" />
            <div className="min-h-screen bg-[#F8F6F2] text-[#171717]">
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
                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                <span className="text-lg font-semibold">{money(order.total)}</span>
                                                {isEmployee && next && <Button size="sm" onClick={() => advanceOrder(order)} className="bg-[#171717] text-white hover:bg-[#333333]">Mark {statusLabel(next)}</Button>}
                                                {isEmployee && order.status === 'pending' && <Button size="sm" variant="outline" onClick={() => setOrderToCancel(order)} className="border-red-200 text-red-700 hover:bg-red-50">Cancel order</Button>}
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
            </div>
        </AuthenticatedLayout>
    );
}
