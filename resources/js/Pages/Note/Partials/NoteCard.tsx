import { Note } from '@/types';
import { DeleteAlertDialog } from './DeleteAlertDialog';
import { EditDialog } from './EditDialog';

interface IProps {
    notes: Note[];
}

const NoteCard = ({ notes }: IProps) => {
    return (
        <>
            {notes.length > 0 ? (
                <div className="space-y-3">
                    {notes.map((note) => {
                        return (
                            <div
                                key={note.id}
                                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                            {note.title}
                                        </h3>
                                        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                                            {note.description || 'No description added yet.'}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <EditDialog note={note} />
                                        <DeleteAlertDialog note={note} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <span className="block py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No notes found.
                </span>
            )}
        </>
    );
};

export default NoteCard;
