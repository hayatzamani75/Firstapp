import { Employee } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';
import { EditEmployeeDialog } from './EditEmployeeDialog';

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-blue-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <Table className="w-full min-w-[820px] table-auto text-left">
                <TableHeader className="bg-blue-700 dark:bg-blue-900">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="w-[12%] px-2 py-3 text-[11px] font-semibold uppercase text-white sm:w-[9%]">
                            ID
                        </TableHead>
                        <TableHead className="w-[28%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[20%]">
                            Employee
                        </TableHead>
                        <TableHead className="w-[27%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[17%]">
                            Phone
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white sm:table-cell sm:w-[27%]">
                            Email
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white lg:table-cell lg:w-[17%]">
                            Address
                        </TableHead>
                        <TableHead className="w-[33%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[27%] lg:w-[10%]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <TableRow
                                key={employee.id}
                                className="border-blue-100 odd:bg-white even:bg-blue-50/70 hover:bg-blue-100/80 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-blue-950/40 dark:hover:bg-blue-900/40"
                            >
                                <TableCell className="px-2 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300">
                                    {employee.id}
                                </TableCell>
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900 dark:text-slate-100">
                                        {employee.name} {employee.lastname}
                                    </div>
                                </TableCell>
                                <TableCell className="break-all px-3 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300">
                                    {employee.phone}
                                </TableCell>
                                <TableCell className="hidden break-all px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 sm:table-cell">
                                    {employee.email}
                                </TableCell>
                                <TableCell
                                    className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 lg:table-cell"
                                    title={employee.address || undefined}
                                >
                                    <span className="block truncate">
                                        {employee.address || 'Not provided'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-2 py-3 align-top">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <EditEmployeeDialog employee={employee} />
                                        <DeleteEmployeeDialog employee={employee} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableCell
                                colSpan={6}
                                className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                            >
                                No employees found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}