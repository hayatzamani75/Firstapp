import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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

            <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-slate-950" />
        </AuthenticatedLayout>
    );
}