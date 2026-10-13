import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Input } from '@/Components/ui/input';
import { Employee, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Pagination from '../Note/Partials/Pagination';
import { CreateEmployeeForm } from './Partials/CreateEmployeeForm';
import EmployeeTable from './Partials/EmployeeTable';

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
    employees: Paginator<Employee>;
}>;

export default function View() {
    const { employees } = usePage<ViewPageProps>().props;
    const [query, setQuery] = useState('');

    const filteredEmployees = useMemo(() => {
        const searchText = query.trim().toLowerCase();
        if (!searchText) return employees.data;

        return employees.data.filter((employee) =>
            [employee.name, employee.lastname, employee.email, employee.phone, employee.address]
                .join(' ')
                .toLowerCase()
                .includes(searchText),
        );
    }, [query, employees.data]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
                    Employees
                </h2>
            }
        >
            <Head title="Employees" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateEmployeeForm />
                    </div>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">Employees</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {filteredEmployees.length} total
                            </span>
                        </header>
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm text-slate-600">
                                    Showing {filteredEmployees.length} of {employees.total} employees
                                </span>
                                <div className="w-full max-w-sm">
                                    <Input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search employee..."
                                        className="border-slate-200 bg-white focus-visible:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4">
                            <EmployeeTable employees={filteredEmployees} />
                            <Pagination links={employees.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}