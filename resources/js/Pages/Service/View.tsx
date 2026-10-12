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

                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <h1 className="py-5 text-center text-2xl font-bold">
                            My Services
                        </h1>
                        <h2 className="py-2 pl-2 text-start text-[12px] font-medium text-gray-700 dark:text-gray-300">
                            Showing {services.from} - {services.to} of {services.total} results
                        </h2>
                        <div className="p-2 text-gray-900 dark:text-gray-100">
                            <ServiceCard services={services.data} />
                            <Pagination links={services.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}