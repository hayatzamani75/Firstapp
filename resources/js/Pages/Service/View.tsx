import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Service } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Pagination from '../Note/Partials/Pagination';
import ServiceCard from './Partials/ServiceCard';
import { CreateServiceForm } from './Partials/CreateServiceForm';

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
    services: Paginator<Service>;
}>;

export default function View() {
    const { services } = usePage<ViewPageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Services
                </h2>
            }
        >
            <Head title="Services" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateServiceForm />
                    </div>

                    <section className="overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <header className="flex flex-col gap-3 bg-gray-800 px-5 py-4 text-white dark:bg-gray-950 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Services</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {services.total} total
                            </span>
                        </header>
                        <div className="flex flex-col gap-1 border-b border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {services.from ?? 0}–{services.to ?? 0} of {services.total} services
                            </span>
                        </div>
                        <div className="p-3 sm:p-4">
                            <ServiceCard services={services.data} />
                            <Pagination links={services.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}