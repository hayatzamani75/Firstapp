import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Teacher } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Pagination from '../Note/Partials/Pagination';
import TeacherCard from './Partials/TeacherCard';
import { CreateTeacherForm } from './Partials/CreateTeacherForm';

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
    teachers: Paginator<Teacher>;
}>;

export default function View() {
    const { teachers } = usePage<ViewPageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Teachers
                </h2>
            }
        >
            <Head title="Teachers" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateTeacherForm />
                    </div>

                    <section className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <header className="flex flex-col gap-3 bg-blue-700 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Teachers</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {teachers.total} total
                            </span>
                        </header>
                        <div className="flex flex-col gap-1 border-b border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing {teachers.from ?? 0}–{teachers.to ?? 0} of {teachers.total} teachers
                            </span>
                        </div>
                        <div className="p-3 sm:p-4">
                            <TeacherCard teachers={teachers.data} />
                            <Pagination links={teachers.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
