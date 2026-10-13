import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const modules = [
    { name: 'Books', href: route('book.view'), accent: 'from-blue-600 to-blue-500' },
    { name: 'Customers', href: route('customer.view'), accent: 'from-emerald-600 to-emerald-500' },
    { name: 'Employees', href: route('employee.view'), accent: 'from-violet-600 to-violet-500' },
    { name: 'Companies', href: route('company.view'), accent: 'from-amber-500 to-orange-500' },
    { name: 'Notes', href: route('note.view'), accent: 'from-pink-600 to-rose-500' },
];

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            headerClassName="bg-orange-100 dark:bg-orange-950"
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="min-h-[calc(100vh-4rem)] bg-orange-100 py-12 dark:bg-orange-950">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>

                    <section className="rounded-xl border border-orange-200 bg-white shadow-sm dark:border-orange-900 dark:bg-gray-800">
                        <div className="border-b border-orange-100 px-5 py-4 dark:border-orange-900">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Quick access
                            </h3>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
                            {modules.map((module) => (
                                <Link
                                    key={module.name}
                                    href={module.href}
                                    className="group rounded-xl border border-gray-200 bg-gradient-to-br p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                                >
                                    <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-r px-2.5 py-2 text-sm font-semibold text-white ${module.accent}`}>
                                        {module.name.slice(0, 1)}
                                    </div>
                                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                                        {module.name}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Open {module.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
