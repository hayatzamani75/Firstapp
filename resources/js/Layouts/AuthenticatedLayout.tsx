import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
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
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/85 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 lg:flex lg:flex-col">
                    <div className="flex h-20 items-center border-b border-slate-200 px-5 dark:border-slate-700">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                                <ApplicationLogo className="block h-6 w-auto fill-current text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
                                    CRM
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                    Workspace
                                </div>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex-1 space-y-2 p-4">
                        {sidebarItems.map(({ label, href, icon: Icon }) => {
                            const routeName = href;
                            const isActive = route().current(routeName);

                            return (
                                <Link
                                    key={routeName}
                                    href={route(routeName)}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-lg border',
                                            isActive
                                                ? 'border-white/20 bg-white/10 text-white'
                                                : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-200 group-hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700',
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex w-full rounded-xl">
                                    <button
                                        type="button"
                                        className="inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium leading-4 text-slate-700 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-100 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 text-xs font-semibold text-white dark:from-slate-700 dark:to-slate-500">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            <span>{user.name}</span>
                                        </span>

                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
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
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800 lg:hidden">
                        <div className="flex h-16 items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <Link href="/">
                                    <ApplicationLogo className="block h-8 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
                                ' border-t border-gray-200 px-2 pb-3 pt-2 dark:border-gray-700'
                            }
                        >
                            <div className="space-y-1">
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('note.view')}
                                    active={route().current('note.view')}
                                >
                                    My Notes
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('book.view')}
                                    active={route().current('book.view')}
                                >
                                    Books
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('company.view')}
                                    active={route().current('company.view')}
                                >
                                    Companies
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('teacher.view')}
                                    active={route().current('teacher.view')}
                                >
                                    Teachers
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('customer.view')}
                                    active={route().current('customer.view')}
                                >
                                    Customers
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('internship.view')}
                                    active={route().current('internship.view')}
                                >
                                    Internships
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('employee.view')}
                                    active={route().current('employee.view')}
                                >
                                    Employees
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('service.view')}
                                    active={route().current('service.view')}
                                >
                                    Services
                                </ResponsiveNavLink>
                            </div>

                            <div className="mt-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {header && (
                        <header className={cn('bg-white shadow dark:bg-gray-800', headerClassName)}>
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}
