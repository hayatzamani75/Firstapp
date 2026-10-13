import { Internship } from '@/types';
import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DeleteInternshipDialog } from './DeleteInternshipDialog';
import { EditInternshipDialog } from './EditInternshipDialog';

interface IProps {
    internships: Internship[];
    sort: 'id';
    direction: 'asc' | 'desc';
}

const InternshipTable = ({ internships, sort, direction }: IProps) => {
    function toggleIdSort() {
        router.get(
            route('internship.view'),
            {
                sort,
                direction: direction === 'asc' ? 'desc' : 'asc',
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-violet-200 bg-white shadow-sm">
            <Table className="w-full min-w-[880px] table-auto text-left">
                <TableHeader className="bg-gradient-to-r from-violet-700 to-indigo-700">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="w-[9%] px-2 py-3 text-[11px] font-semibold uppercase text-white">
                            <button
                                type="button"
                                onClick={toggleIdSort}
                                aria-label={`Sort by ID ${direction === 'asc' ? 'descending' : 'ascending'}`}
                                title={`Sort by ID ${direction === 'asc' ? 'descending' : 'ascending'}`}
                                className="inline-flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                ID
                                {direction === 'asc' ? (
                                    <ArrowUp aria-hidden="true" size={14} />
                                ) : (
                                    <ArrowDown aria-hidden="true" size={14} />
                                )}
                            </button>
                        </TableHead>
                        <TableHead className="w-[22%] px-3 py-3 text-[11px] font-semibold uppercase text-white">
                            Intern
                        </TableHead>
                        <TableHead className="w-[24%] px-3 py-3 text-[11px] font-semibold uppercase text-white">
                            Email
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white md:table-cell md:w-[16%]">
                            Phone
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white xl:table-cell xl:w-[18%]">
                            Address
                        </TableHead>
                        <TableHead className="w-[14%] px-3 py-3 text-[11px] font-semibold uppercase text-white">
                            Contract
                        </TableHead>
                        <TableHead className="w-[17%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.length > 0 ? (
                        internships.map((internship) => (
                            <TableRow
                                key={internship.id}
                                className="border-violet-100 odd:bg-white even:bg-violet-50/60 hover:bg-violet-100/80"
                            >
                                <TableCell className="px-2 py-3 align-top text-sm tabular-nums text-slate-600">
                                    {internship.id}
                                </TableCell>
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900">
                                        {internship.name} {internship.lastname}
                                    </div>
                                </TableCell>
                                <TableCell className="break-all px-3 py-3 align-top text-sm text-slate-600">
                                    {internship.email}
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm text-slate-600 md:table-cell">
                                    {internship.phone || 'Not provided'}
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm text-slate-600 xl:table-cell" title={internship.address || undefined}>
                                    <span className="block truncate">
                                        {internship.address || 'Not provided'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-3 py-3 align-top text-sm text-slate-700">
                                    {internship.contract}
                                </TableCell>
                                <TableCell className="px-2 py-3 align-top">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <EditInternshipDialog internship={internship} />
                                        <DeleteInternshipDialog internship={internship} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableCell colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                                No internships found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default InternshipTable;
