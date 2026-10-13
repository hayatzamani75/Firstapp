import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Input } from '@/Components/ui/input';
import { PageProps, Teacher } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
    const [query, setQuery] = useState('');

    const filteredTeachers = useMemo(() => {
        const searchText = query.trim().toLowerCase();
        if (!searchText) return teachers.data;

        return teachers.data.filter((teacher) =>
            [teacher.name, teacher.lastname, teacher.position, teacher.email, teacher.phone_number_1, teacher.phone_number_2, teacher.address]
                .join(' ')
                .toLowerCase()
                .includes(searchText),
        );
    }, [query, teachers.data]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
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

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Teachers</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {filteredTeachers.length} total
                            </span>
                        </header>

                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-slate-600">
                                    Showing {filteredTeachers.length} of {teachers.total} teachers
                                </span>
                                <div className="w-full max-w-sm">
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search teacher..."
                                        className="border-slate-200 bg-white focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4">
                            <TeacherCard teachers={filteredTeachers} />
                            <Pagination links={teachers.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
