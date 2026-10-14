import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpenText,
    BriefcaseBusiness,
    Building2,
    ChevronDown,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    NotebookText,
    Package,
    UserCircle2,
    Users,
    Wrench,
    X,
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

const sidebarItems = [
    { label: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { label: 'My Notes', href: 'note.view', icon: NotebookText },
    { label: 'Books', href: 'book.view', icon: BookOpenText },
    { label: 'Product', href: 'product.view', icon: Package },
    { label: 'Education', href: 'education.view', icon: GraduationCap },
    { label: 'Companies', href: 'company.view', icon: Building2 },
    { label: 'Teachers', href: 'teacher.view', icon: GraduationCap },
    { label: 'Customers', href: 'customer.view', icon: Users },
    { label: 'Internships', href: 'internship.view', icon: BriefcaseBusiness },
    { label: 'Employees', href: 'employee.view', icon: UserCircle2 },
    { label: 'Services', href: 'service.view', icon: Wrench },
];

export default function Authenticated({
    header,
    headerClassName,
    children,
}: PropsWithChildren<{ header?: ReactNode; headerClassName?: string }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-slate-700 bg-[#172554] shadow-2xl shadow-slate-900/20 lg:flex lg:flex-col">
                    <div className="flex h-20 items-center border-b border-slate-700 px-5">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 shadow-lg shadow-indigo-500/30">
                                <ApplicationLogo className="block h-6 w-auto fill-current text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold tracking-wide text-white">
                                    CRM
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                                    Workspace
                                </div>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-2 p-4">
                        {sidebarItems.map(({ label, href, icon: Icon }) => {
                            const isActive = route().current(href);

                            return (
                                <Link
                                    key={href}
                                    href={route(href)}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-[#2563EB] text-[#FFFFFF] shadow-lg shadow-blue-500/25'
                                            : 'text-[#FFFFFF] hover:bg-slate-800/80 hover:text-white',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-lg border',
                                            isActive
                                                ? 'border-white/20 bg-white/10 text-white'
                                                : 'border-slate-700 bg-slate-800 text-[#FFFFFF] group-hover:border-slate-600 group-hover:bg-slate-700',
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
                        <div className="flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <Link href="/">
                                    <ApplicationLogo className="block h-8 w-auto fill-current text-slate-800" />
                                </Link>
                            </div>

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <div
                            className={
                                (showingNavigationDropdown ? 'block' : 'hidden') +
                                ' border-t border-slate-200 bg-slate-50 px-2 pb-3 pt-2'
                            }
                        >
                            <div className="space-y-1">
                                {sidebarItems.map(({ label, href, icon: Icon }) => {
                                    const isActive = route().current(href);
                                    return (
                                        <ResponsiveNavLink
                                            key={href}
                                            href={route(href)}
                                            active={isActive}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                                    <Icon className="h-3.5 w-3.5" />
                                                </span>
                                                <span>{label}</span>
                                            </span>
                                        </ResponsiveNavLink>
                                    );
                                })}
                            </div>
                        </div>
                    </nav>

                    {header && (
                        <header className={cn('border-b border-slate-700 bg-[#172554] shadow-lg shadow-slate-900/20', headerClassName)}>
                            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-center gap-3 text-white">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                                            <LayoutDashboard className="h-5 w-5 text-blue-100" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/80">
                                                Main Dashboard
                                            </p>
                                            <div className="text-xl font-bold text-white">{header}</div>
                                        </div>
                                    </div>

                                    <div className="self-end sm:self-auto">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button
                                                    type="button"
                                                    aria-label="Open account menu"
                                                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                                >
                                                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                    <span className="max-w-32 truncate">{user.name}</span>
                                                    <ChevronDown className="h-4 w-4" />
                                                </button>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content contentClasses="py-1 bg-white">
                                                <Dropdown.Link href={route('profile.edit')}>
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                                    <span className="flex items-center gap-2">
                                                        <LogOut className="h-4 w-4" />
                                                        Log Out
                                                    </span>
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </header>
                    )}

                    <main className="min-h-screen bg-[linear-gradient(180deg,#f0fdf4_0%,#dcfce7_100%)] dark:bg-slate-950">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
