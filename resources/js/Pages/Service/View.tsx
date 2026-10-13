import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Input } from '@/Components/ui/input';
import { PageProps, Service } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
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
    const [query, setQuery] = useState('');

    const filteredServices = useMemo(() => {
        const searchText = query.trim().toLowerCase();
        if (!searchText) return services.data;

        return services.data.filter((service) =>
            [service.name, service.service_type, service.parts]
                .join(' ')
                .toLowerCase()
                .includes(searchText),
        );
    }, [query, services.data]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
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

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Services</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {filteredServices.length} total
                            </span>
                        </header>
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-slate-600">
                                    Showing {filteredServices.length} of {services.total} services
                                </span>
                                <div className="relative w-full max-w-sm">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search service..."
                                        className="border-slate-200 bg-white pl-9 focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4">
                            <ServiceCard services={filteredServices} />
                            <Pagination links={services.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}