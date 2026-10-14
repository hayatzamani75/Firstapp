import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';

export default function Product() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
                    Product
                </h2>
            }
        >
            <Head title="Product" />

            <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-12 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#1d4ed8] shadow-xl shadow-blue-900/20">
                        <div className="relative p-8 sm:p-10 lg:p-12">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.25),transparent_35%)]" />
                            <div className="relative max-w-4xl">
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
                                    Catalog
                                </span>
                                <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
                                    Product
                                </h1>
                                <p className="mt-5 max-w-2xl text-lg font-medium text-blue-100 sm:text-xl">
                                    Keep your product information organized in one place.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                Product overview
                            </h2>
                        </div>
                        <div className="flex min-h-56 flex-col items-center justify-center px-5 py-10 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                                <Package className="h-6 w-6" />
                            </div>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                                No products yet
                            </p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Product records will appear here when they are added.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}