import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Book, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CreateBookForm } from './Partials/CreateBookForm';
import BookCard from './Partials/BookCard';
import Pagination from '../Note/Partials/Pagination';

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
    books: Paginator<Book>;
}>;

export default function View() {
    const { books } = usePage<ViewPageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
                    Books
                </h2>
            }
        >
            <Head title="Books" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateBookForm />
                    </div>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">My Books</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {books.total} total
                            </span>
                        </header>
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Showing {books.from ?? 0}–{books.to ?? 0} of {books.total} books
                        </div>
                        <div className="p-3 text-slate-900 sm:p-4">
                            <BookCard books={books.data} />
                            <Pagination links={books.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
