import { Note } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DeleteAlertDialog } from './DeleteAlertDialog';
import { EditDialog } from './EditDialog';

interface IProps {
    notes: Note[];
}

const NoteCard = ({ notes }: IProps) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <Table className="w-full min-w-[560px] table-auto text-left">
                <TableHeader className="bg-[#172554]">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="hidden w-[8%] px-2 py-3 text-[11px] font-semibold uppercase text-white sm:table-cell">
                            ID
                        </TableHead>
                        <TableHead className="w-[42%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[36%]">
                            Title
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white md:table-cell md:w-[34%]">
                            Description
                        </TableHead>
                        <TableHead className="w-[35%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[24%]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <TableRow
                                key={note.id}
                                className="border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:hover:bg-slate-700"
                            >
                                <TableCell className="hidden px-2 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300 sm:table-cell">
                                    {note.id}
                                </TableCell>
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900 dark:text-slate-100">
                                        {note.title}
                                    </div>
                                    <div className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-500 md:hidden dark:text-slate-400">
                                        {note.description || 'No description added yet.'}
                                    </div>
                                </TableCell>
                                <TableCell
                                    className="hidden px-3 py-3 align-top text-sm text-slate-600 md:table-cell dark:text-slate-300"
                                    title={note.description || undefined}
                                >
                                    <span className="block whitespace-pre-wrap break-words line-clamp-3">
                                        {note.description || 'No description added yet.'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-2 py-3 align-top">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <EditDialog note={note} />
                                        <DeleteAlertDialog note={note} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableCell
                                colSpan={4}
                                className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                            >
                                No notes found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default NoteCard;
