import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Company, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Pagination from '../Note/Partials/Pagination';
import CompanyCard from './Partials/CompanyCard';
import { CreateCompanyForm } from './Partials/CreateCompanyForm';

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
    companies: Paginator<Company>;
}>;

export default function View() {
    const { companies } = usePage<ViewPageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Companies
                </h2>
            }
        >
            <Head title="Companies" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateCompanyForm />
                    </div>

                    <section className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <header className="flex flex-col gap-3 bg-blue-700 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Companies</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {companies.total} total
                            </span>
                        </header>
                        <div className="flex flex-col gap-1 border-b border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {companies.from ?? 0}–{companies.to ?? 0} of {companies.total} companies
                            </span>
                        </div>
                        <div className="p-3 sm:p-4">
                            <CompanyCard companies={companies.data} />
                            <Pagination links={companies.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
