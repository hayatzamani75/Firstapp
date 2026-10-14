import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BookOpenText, Building2, GraduationCap, School } from 'lucide-react';

const categories = [
    {
        name: 'School',
        description: 'School information',
        icon: School,
        accent: 'from-blue-600 to-blue-500',
    },
    {
        name: 'University',
        description: 'University information',
        icon: Building2,
        accent: 'from-emerald-600 to-emerald-500',
    },
    {
        name: 'Institut',
        description: 'Institute information',
        icon: GraduationCap,
        accent: 'from-violet-600 to-indigo-500',
    },
    {
        name: 'Kurs',
        description: 'Course information',
        icon: BookOpenText,
        accent: 'from-amber-500 to-orange-500',
    },
];

export default function Education() {
    return (
        <AuthenticatedLayout
            headerClassName="bg-[#172554] dark:bg-[#172554]"
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Education
                </h2>
            }
        >
            <Head title="Education" />

            <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-12 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#1d4ed8] shadow-xl shadow-blue-900/20">
                        <div className="relative p-8 sm:p-10 lg:p-12">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.25),transparent_35%)]" />
                            <div className="relative max-w-4xl">
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
                                    Education
                                </span>
                                <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
                                    Education
                                </h1>
                                <p className="mt-5 max-w-2xl text-lg font-medium text-blue-100 sm:text-xl">
                                    Keep school, university, institute, and course information together.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                Quick access
                            </h3>
                        </div>
                        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
                            {categories.map(({ name, description, icon: Icon, accent }) => (
                                <div
                                    key={name}
                                    className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
                                >
                                    <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-r p-2.5 text-white ${accent}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="text-base font-semibold text-slate-800 dark:text-slate-100">
                                        {name}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        {description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}