import { Teacher } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DeleteTeacherDialog } from './DeleteTeacherDialog';
import { EditTeacherDialog } from './EditTeacherDialog';

interface IProps {
    teachers: Teacher[];
}

const TeacherCard = ({ teachers }: IProps) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-blue-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <Table className="w-full min-w-[900px] table-auto text-left">
                <TableHeader className="bg-blue-700 dark:bg-blue-900">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="w-[7%] px-2 py-3 text-[11px] font-semibold uppercase text-white">
                            ID
                        </TableHead>
                        <TableHead className="w-[18%] px-3 py-3 text-[11px] font-semibold uppercase text-white">
                            Teacher
                        </TableHead>
                        <TableHead className="hidden w-[12%] px-3 py-3 text-[11px] font-semibold uppercase text-white md:table-cell">
                            Position
                        </TableHead>
                        <TableHead className="w-[20%] px-3 py-3 text-[11px] font-semibold uppercase text-white">
                            Email
                        </TableHead>
                        <TableHead className="hidden w-[12%] px-3 py-3 text-[11px] font-semibold uppercase text-white md:table-cell">
                            Phone 1
                        </TableHead>
                        <TableHead className="hidden w-[12%] px-3 py-3 text-[11px] font-semibold uppercase text-white lg:table-cell">
                            Phone 2
                        </TableHead>
                        <TableHead className="hidden w-[22%] px-3 py-3 text-[11px] font-semibold uppercase text-white lg:table-cell">
                            Address
                        </TableHead>
                        <TableHead className="w-[15%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                            <TableRow
                                key={teacher.id}
                                className="border-blue-100 odd:bg-white even:bg-blue-50/70 hover:bg-blue-100/80 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-blue-950/40 dark:hover:bg-blue-900/40"
                            >
                                <TableCell className="px-2 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300">
                                    {teacher.id}
                                </TableCell>
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900 dark:text-slate-100">
                                        {teacher.name} {teacher.lastname}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 md:table-cell">
                                    <span className="block break-words">
                                        {teacher.position}
                                    </span>
                                </TableCell>
                                <TableCell className="break-all px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300">
                                    {teacher.email}
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300 md:table-cell">
                                    {teacher.phone_number_1 || 'Not provided'}
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300 lg:table-cell">
                                    {teacher.phone_number_2 || 'Not provided'}
                                </TableCell>
                                <TableCell
                                    className="hidden w-[22%] px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 lg:table-cell"
                                    title={teacher.address || undefined}
                                >
                                    <span className="block break-words text-sm leading-6">
                                        {teacher.address || 'Not provided'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-2 py-3 align-top">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <EditTeacherDialog teacher={teacher} />
                                        <DeleteTeacherDialog teacher={teacher} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableCell
                                colSpan={8}
                                className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                            >
                                No teachers found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TeacherCard;
