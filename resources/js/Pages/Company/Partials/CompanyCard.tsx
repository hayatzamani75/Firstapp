import { Company } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { EditCompanyDialog } from './EditCompanyDialog';

interface IProps {
    companies: Company[];
}

const CompanyCard = ({ companies }: IProps) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <Table className="w-full min-w-[720px] table-auto text-left">
            <TableHeader className="bg-[#172554]">
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="w-[44%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[34%] lg:w-[24%]">
                            Company
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white sm:table-cell sm:w-[26%] lg:w-[20%]">
                            Type
                        </TableHead>
                        <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white lg:table-cell lg:w-[42%]">
                            Address
                        </TableHead>
                        <TableHead className="w-[56%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[40%] lg:w-[14%]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companies.length > 0 ? (
                        companies.map((company) => (
                            <TableRow
                                key={company.id}
                                className="border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-800 dark:hover:bg-slate-700"
                            >
                                <TableCell className="px-3 py-3 align-top">
                                    <div className="break-words font-semibold text-slate-900 dark:text-slate-100">
                                        {company.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        ID {company.id}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 sm:table-cell">
                                    <span className="block break-words">
                                        {company.type}
                                    </span>
                                </TableCell>
                                <TableCell
                                    className="hidden px-3 py-3 align-top text-sm text-slate-600 dark:text-slate-300 lg:table-cell"
                                    title={company.address || undefined}
                                >
                                    <span className="block truncate">
                                        {company.address || 'Not provided'}
                                    </span>
                                </TableCell>
                                <TableCell className="px-2 py-3 align-top">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                        <EditCompanyDialog company={company} />
                                        <DeleteCompanyDialog company={company} />
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
                                No companies found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompanyCard;
