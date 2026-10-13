import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Internship, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Internships
                </h2>
            }
        >
            <Head title="Internships" />

            <div className="min-h-screen bg-gradient-to-br from-violet-100 via-sky-50 to-indigo-100 py-12 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateInternshipForm />
                    </div>

                    <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-[0_25px_80px_-30px_rgba(109,40,217,0.45)] dark:border-violet-900 dark:bg-slate-900">
                        <header className="flex flex-col gap-3 bg-gradient-to-r from-violet-700 to-indigo-700 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Internships</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {internships.total} total
                            </span>
                        </header>
                        <div className="flex flex-col gap-1 border-b border-violet-100 bg-violet-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {internships.from ?? 0}–{internships.to ?? 0} of {internships.total} internships
                            </span>
                        </div>
                        <div className="p-3 sm:p-4">
                            <InternshipTable internships={internships.data} sort={sort} direction={direction} />
                            <Pagination links={internships.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
