import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const modules = [
    { name: 'Books', href: route('book.view'), accent: 'from-blue-600 to-blue-500' },
    { name: 'Customers', href: route('customer.view'), accent: 'from-emerald-600 to-emerald-500' },
    { name: 'Internships', href: route('internship.view'), accent: 'from-violet-600 to-indigo-500' },
    { name: 'Employees', href: route('employee.view'), accent: 'from-fuchsia-600 to-violet-500' },
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

            <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-12 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#1d4ed8] shadow-xl shadow-blue-900/20">
                        <div className="relative p-8 sm:p-10 lg:p-12">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.25),transparent_35%)]" />

                            <div className="relative max-w-4xl">
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
                                    Welcome
                                </span>
                                <h1 className="mt-6 animate-[slideInUp_0.9s_ease-out] text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
                                    Welcome to Kabul Innovation Center
                                </h1>
                                <p className="mt-5 max-w-2xl text-lg font-medium text-blue-100 sm:text-xl">
                                    KIC delivers modern services, digital solutions, and impactful programs that empower individuals, teams, and communities.
                                </p>
                                <p className="mt-3 max-w-2xl text-sm text-blue-50/90 sm:text-base">
                                    We connect technology, creativity, and opportunity to build a brighter future through smart services and innovative development.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                Quick access
                            </h3>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
                            {modules.map((module) => (
                                <Link
                                    key={module.name}
                                    href={module.href}
                                    className="group rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
                                >
                                    <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-r px-2.5 py-2 text-sm font-semibold text-white ${module.accent}`}>
                                        {module.name.slice(0, 1)}
                                    </div>
                                    <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                        {module.name}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
