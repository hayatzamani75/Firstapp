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
        <div className="overflow-hidden rounded-lg border border-blue-200 dark:border-slate-700">
            <Table className="table-fixed text-left">
                <TableHeader className="bg-blue-700 dark:bg-blue-900">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="w-[38%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[26%] lg:w-[22%]">
                            Teacher
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white sm:table-cell sm:w-[18%] lg:w-[16%]">
                            Position
                        </TableHead>
                        <TableHead className="w-[38%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[30%] lg:w-[26%]">
                            Email
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white lg:table-cell lg:w-[22%]">
                            Address
                        </TableHead>
                        <TableHead className="w-[24%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[26%] lg:w-[14%]">
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
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900 dark:text-slate-100">
                                        {teacher.name} {teacher.lastname}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        ID {teacher.id}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 sm:table-cell">
                                    <span className="block break-words">
                                        {teacher.position}
                                    </span>
                                </TableCell>
                                <TableCell className="break-all px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300">
                                    {teacher.email}
                                </TableCell>
                                <TableCell
                                    className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 lg:table-cell"
                                    title={teacher.address || undefined}
                                >
                                    <span className="block truncate">
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
                                colSpan={5}
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
