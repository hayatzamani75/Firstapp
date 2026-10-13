import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Input } from '@/Components/ui/input';
import { Internship, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Pagination from '../Note/Partials/Pagination';
import { CreateInternshipForm } from './Partials/CreateInternshipForm';
import InternshipTable from './Partials/InternshipTable';

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
};

type ViewPageProps = PageProps<{
    internships: Paginator<Internship>;
    sort: 'id';
    direction: 'asc' | 'desc';
}>;

export default function View() {
    const { internships, sort, direction } = usePage<ViewPageProps>().props;
    const [query, setQuery] = useState('');

    const filteredInternships = useMemo(() => {
        const searchText = query.trim().toLowerCase();
        if (!searchText) return internships.data;

        return internships.data.filter((internship) =>
            [internship.name, internship.lastname, internship.email, internship.phone, internship.address, internship.contract]
                .join(' ')
                .toLowerCase()
                .includes(searchText),
        );
    }, [query, internships.data]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
                    Internships
                </h2>
            }
        >
            <Head title="Internships" />

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-100 py-12 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateInternshipForm />
                    </div>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_80px_-30px_rgba(15,118,110,0.28)]">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Internships</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {filteredInternships.length} total
                            </span>
                        </header>
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-slate-600">
                                    Showing {filteredInternships.length} of {internships.total} internships
                                </span>
                                <div className="w-full max-w-sm">
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search internship..."
                                        className="border-slate-200 bg-white focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4">
                            <InternshipTable internships={filteredInternships} sort={sort} direction={direction} />
                            <Pagination links={internships.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
