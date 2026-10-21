import RegisterManagerAccountForm from '@/Components/RegisterManagerAccountForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BookOpenText,
    BriefcaseBusiness,
    Building2,
    GraduationCap,
    LayoutDashboard,
    NotebookText,
    Package,
    Tags,
    Users,
    UserRoundCog,
    Warehouse,
    Wrench,
} from 'lucide-react';

const modules = [
    { name: 'Product List', description: 'Catalog, pricing and inventory', href: 'product.list', icon: Package, color: 'bg-blue-50 text-blue-700' },
    { name: 'Warehouse', description: 'Inventory, stock levels and movements', href: 'warehouse.view', icon: Warehouse, color: 'bg-sky-50 text-sky-700' },
    { name: 'Categories', description: 'Browse the product catalog by category', href: 'categories.view', icon: Tags, color: 'bg-amber-50 text-amber-700' },
    { name: 'Customers', description: 'Customer records and profiles', href: 'customer.view', icon: Users, color: 'bg-emerald-50 text-emerald-700' },
    { name: 'Employees', description: 'Team members and access', href: 'employee.view', icon: UserRoundCog, color: 'bg-violet-50 text-violet-700' },
    { name: 'Companies', description: 'Organizations and partners', href: 'company.view', icon: Building2, color: 'bg-amber-50 text-amber-700' },
    { name: 'Books', description: 'Manage your library', href: 'book.view', icon: BookOpenText, color: 'bg-rose-50 text-rose-700' },
    { name: 'Notes', description: 'Workspace notes and updates', href: 'note.view', icon: NotebookText, color: 'bg-cyan-50 text-cyan-700' },
    { name: 'Internships', description: 'Programs and opportunities', href: 'internship.view', icon: BriefcaseBusiness, color: 'bg-indigo-50 text-indigo-700' },
    { name: 'Teachers', description: 'Teacher directory', href: 'teacher.view', icon: GraduationCap, color: 'bg-orange-50 text-orange-700' },
    { name: 'Services', description: 'Services and offerings', href: 'service.view', icon: Wrench, color: 'bg-teal-50 text-teal-700' },
    { name: 'Education', description: 'Education resources', href: 'education.view', icon: GraduationCap, color: 'bg-fuchsia-50 text-fuchsia-700' },
];

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const isManager = auth.user.role === 'manager';

    return (
        <AuthenticatedLayout header="Admin workspace">
            <Head title="Admin workspace" />

            <div className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                <div className="mx-auto max-w-7xl space-y-8">
                    <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.38),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.18),transparent_45%)]" />
                        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100">
                                    <LayoutDashboard className="h-3.5 w-3.5" />
                                    ADMINISTRATION
                                </span>
                                <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">Welcome back, {auth.user.name}</h1>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                                    Manage the people, content, and operations that power your workspace from one place.
                                </p>
                            </div>
                            <Link href={route('product.view')} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50">
                                Open storefront <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    {isManager && (
                        <section className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="font-semibold text-slate-900">Manager accounts</h2>
                                <p className="mt-1 text-sm text-slate-500">Invite a manager to help administer this workspace.</p>
                            </div>
                            <RegisterManagerAccountForm buttonClassName="w-full sm:w-auto" />
                        </section>
                    )}

                    <section>
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Workspace</p>
                                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Manage your project</h2>
                            </div>
                            <span className="hidden text-sm text-slate-500 sm:block">{modules.length} management areas</span>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {modules.map(({ name, description, href, icon: Icon, color }) => (
                                <Link key={name} href={route(href)} className="group flex min-h-32 items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/[0.06]">
                                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                                            {name}<ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-600" />
                                        </span>
                                        <span className="mt-1 block text-sm leading-5 text-slate-500">{description}</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
