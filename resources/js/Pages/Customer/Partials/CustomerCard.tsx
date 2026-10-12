import { Customer } from '@/types';
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
import { DeleteCustomerDialog } from './DeleteCustomerDialog';
import { EditCustomerDialog } from './EditCustomerDialog';

interface IProps {
    customers: Customer[];
    sort: 'id';
    direction: 'asc' | 'desc';
}

const CustomerCard = ({ customers, sort, direction }: IProps) => {
    function toggleIdSort() {
        router.get(
            route('customer.view'),
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
        <div className="overflow-hidden rounded-lg border border-blue-200 dark:border-slate-700">
            <Table className="table-fixed text-left">
                <TableHeader className="bg-blue-700 dark:bg-blue-900">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="w-[14%] px-2 py-3 text-[11px] font-semibold uppercase text-white sm:w-[12%] md:w-[8%] xl:w-[7%]">
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
                        <TableHead className="w-[28%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[26%] md:w-[20%] xl:w-[18%]">
                            Customer
                        </TableHead>
                        <TableHead className="w-[35%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[38%] md:w-[28%] xl:w-[25%]">
                            Email
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white md:table-cell md:w-[18%] xl:w-[13%]">
                            Phone
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white xl:table-cell xl:w-[21%]">
                            Address
                        </TableHead>
                        <TableHead className="w-[23%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[24%] md:w-[26%] xl:w-[16%]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <TableRow
                                key={customer.id}
                                className="border-blue-100 odd:bg-white even:bg-blue-50/70 hover:bg-blue-100/80 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-blue-950/40 dark:hover:bg-blue-900/40"
                            >
                                <TableCell className="px-2 py-3 align-top text-sm tabular-nums text-slate-600 dark:text-slate-300">
                                    {customer.id}
                                </TableCell>
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900 dark:text-slate-100">
                                        {customer.name} {customer.lastname}
                                    </div>
                                </TableCell>
                                <TableCell className="break-all px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300">
                                    {customer.email}
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 md:table-cell">
                                    {customer.phone || 'Not provided'}
                                </TableCell>
                                <TableCell
                                    className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 xl:table-cell"
                                    title={customer.address || undefined}
                                >
                                    <span className="block truncate">
                                        {customer.address || 'Not provided'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-2 py-3 align-top">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <EditCustomerDialog customer={customer} />
                                        <DeleteCustomerDialog customer={customer} />
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
                                No customers found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CustomerCard;
