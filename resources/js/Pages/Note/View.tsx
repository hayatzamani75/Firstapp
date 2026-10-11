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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
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
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <h1 className="py-5 text-center text-2xl font-bold">
                            My Notes
                        </h1>
                        <h2 className="py-2 text-start pl-2 text-[12px] text font-medium text-gray-700 dark:text-gray-300">
                            Showing {notes.from} - {notes.to} of {notes.total}{' '}
                            results
                        </h2>
                        <div className="p-2 text-gray-900 dark:text-gray-100">
                            <NoteCard notes={notes.data} />
                            <Pagination links={notes.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
