import { OrderRecord } from '@/types';

const money = (amount: number | string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));

export type InvoiceContentSize = 'compact' | 'standard' | 'large';

export default function OrderInvoice({ order, contentSize }: { order: OrderRecord; contentSize: InvoiceContentSize }) {
    const customer = order.user?.customer_profile;
    const customerName = [customer?.name ?? order.user?.name, customer?.lastname ?? order.user?.lastname]
        .filter(Boolean)
        .join(' ');
    const subtotalCents = order.items.reduce((sum, item) => {
        const originalUnitPrice = Number(item.original_unit_price ?? item.unit_price);
        return sum + Math.round(originalUnitPrice * 100) * item.quantity;
    }, 0);
    const lineTotalCents = order.items.reduce((sum, item) => sum + Math.round(Number(item.line_total) * 100), 0);
    const discountCents = Math.max(0, subtotalCents - lineTotalCents);

    return (
        <article id="order-invoice" data-content-size={contentSize} className="invoice-print-root hidden bg-white text-slate-900">
            <header className="invoice-header flex items-start justify-between gap-8 border-b-2 border-slate-900 pb-6">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">KIC Store</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">Invoice</h1>
                    <p className="mt-1 text-sm text-slate-500">Order #{order.id}</p>
                </div>
                <div className="text-right text-sm">
                    <p className="font-semibold">Order date</p>
                    <p className="mt-1 text-slate-600">{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="mt-3 font-semibold">Status</p>
                    <p className="mt-1 capitalize text-slate-600">{order.status}</p>
                </div>
            </header>

            <section className="invoice-customer grid grid-cols-2 gap-8 border-b border-slate-200 py-6">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer</h2>
                    <p className="mt-2 font-semibold">{customerName || 'Customer'}</p>
                    <p className="mt-1 text-sm text-slate-600">{customer?.email ?? order.user?.email ?? '—'}</p>
                </div>
                <div className="pt-5 text-sm text-slate-600">
                    {customer?.phone && <p>{customer.phone}</p>}
                    {customer?.address && <p className="mt-1 whitespace-pre-wrap">{customer.address}</p>}
                </div>
            </section>

            <table className="invoice-items w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wider text-slate-500">
                        <th className="py-3 pr-3 font-semibold">Product</th>
                        <th className="px-3 py-3 text-right font-semibold">Qty</th>
                        <th className="px-3 py-3 text-right font-semibold">Unit price</th>
                        <th className="py-3 pl-3 text-right font-semibold">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 align-top">
                            <td className="py-4 pr-3">
                                <p className="font-semibold">{item.product_name}</p>
                                <p className="mt-1 text-xs text-slate-500">{[item.category, item.sku, item.size, item.color].filter(Boolean).join(' · ')}</p>
                            </td>
                            <td className="px-3 py-4 text-right tabular-nums">{item.quantity}</td>
                            <td className="px-3 py-4 text-right tabular-nums">{money(item.unit_price)}</td>
                            <td className="py-4 pl-3 text-right font-medium tabular-nums">{money(item.line_total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <section className="invoice-totals ml-auto mt-6 w-full max-w-xs space-y-3 text-sm">
                <div className="flex justify-between gap-6 text-slate-600">
                    <span>Subtotal</span><span className="tabular-nums">{money(subtotalCents / 100)}</span>
                </div>
                <div className="flex justify-between gap-6 text-slate-600">
                    <span>Discount</span><span className="tabular-nums">−{money(discountCents / 100)}</span>
                </div>
                <div className="flex justify-between gap-6 border-t-2 border-slate-900 pt-3 text-base font-bold">
                    <span>Total</span><span className="tabular-nums">{money(order.total)}</span>
                </div>
            </section>

            <footer className="invoice-footer mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
                Thank you for your order.
            </footer>
        </article>
    );
}
