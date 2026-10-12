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
}>;

export default function View() {
    const { customers } = usePage<ViewPageProps>().props;

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

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <h1 className="py-5 text-center text-2xl font-bold">
                            My Customers
                        </h1>
                        <h2 className="py-2 pl-2 text-start text-[12px] font-medium text-gray-700 dark:text-gray-300">
                            Showing {customers.from} - {customers.to} of {customers.total}{' '}
                            results
                        </h2>
                        <div className="p-2 text-gray-900 dark:text-gray-100">
                            <CustomerCard customers={customers.data} />
                            <Pagination links={customers.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
