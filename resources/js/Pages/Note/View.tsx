import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Note, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CreateNoteForm } from './Partials/CreateNoteForm';
import NoteCard from './Partials/NoteCard';
import Pagination from './Partials/Pagination';

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
    notes: Paginator<Note>;
}>;

export default function View() {
    const { notes } = usePage<ViewPageProps>().props;

    // const notes = props.notes;
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white dark:text-white">
                    Note
                </h2>
            }
        >
            <Head title="Note" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <CreateNoteForm />
                    </div>
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex flex-col gap-3 bg-[#172554] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-lg font-semibold">My Notes</h1>
                            <span className="inline-flex w-fit items-center rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium">
                                {notes.total} total
                            </span>
                        </header>
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                            Showing {notes.from ?? 0}–{notes.to ?? 0} of {notes.total} notes
                        </div>
                        <div className="p-3 text-slate-900 sm:p-4">
                            <NoteCard notes={notes.data} />
                            <Pagination links={notes.links} />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
