import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Input } from '@/Components/ui/input';
import { Customer, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
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
    const [query, setQuery] = useState('');

    const filteredCustomers = useMemo(() => {
        const searchText = query.trim().toLowerCase();
        if (!searchText) return customers.data;

        return customers.data.filter((customer) =>
            [customer.name, customer.lastname, customer.email, customer.phone, customer.address]
                .join(' ')
                .toLowerCase()
                .includes(searchText),
        );
    }, [query, customers.data]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
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

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Customers</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {filteredCustomers.length} total
                            </span>
                        </header>
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-slate-600">
                                    Showing {filteredCustomers.length} of {customers.total} customers
                                </span>
                                <div className="relative w-full max-w-sm">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search customer..."
                                        className="border-slate-200 bg-white pl-9 focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4">
                            <CustomerCard
                                customers={filteredCustomers}
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
