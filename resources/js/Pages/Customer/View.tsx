import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Customer, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Pagination from '../Note/Partials/Pagination';
import CustomerCard from './Partials/CustomerCard';
import { CreateCustomerForm } from './Partials/CreateCustomerForm';

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

type ViewPageProps = PageProps<{
    customers: Paginator<Customer>;
    sort: 'id';
    direction: 'asc' | 'desc';
}>;

export default function View() {
    const { customers, sort, direction } = usePage<ViewPageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Customers
                </h2>
            }
        >
            <Head title="Customers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateCustomerForm />
                    </div>

                    <section className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <header className="flex flex-col gap-3 bg-blue-700 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Customers</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {customers.total} total
                            </span>
                        </header>
                        <div className="flex flex-col gap-1 border-b border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {customers.from ?? 0}–{customers.to ?? 0} of {customers.total} customers
                            </span>
                        </div>
                        <div className="p-3 sm:p-4">
                            <CustomerCard
                                customers={customers.data}
                                sort={sort}
                                direction={direction}
                            />
                            <Pagination links={customers.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
