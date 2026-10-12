import { Book } from '@/types';
import { DeleteBookDialog } from './DeleteBookDialog';
import { EditBookDialog } from './EditBookDialog';

interface IProps {
    books: Book[];
}

const BookCard = ({ books }: IProps) => {
    return (
        <>
            {books.length > 0 ? (
                <div className="space-y-3">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                                        Book
                                    </div>
                                    <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {book.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {book.title}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                                        {book.description || 'No description added yet.'}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <EditBookDialog book={book} />
                                    <DeleteBookDialog book={book} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="block py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No books found.
                </span>
            )}
        </>
    );
};

export default BookCard;
