import { Service } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { EditServiceDialog } from './EditServiceDialog';

interface IProps {
    services: Service[];
}

const ServiceCard = ({ services }: IProps) => (
    <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
        <Table className="table-fixed text-left">
            <TableHeader className="bg-gray-800 dark:bg-gray-950">
                <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="w-[38%] px-3 py-3 text-[11px] font-semibold uppercase text-white sm:w-[25%] lg:w-[22%]">
                        Service
                    </TableHead>
                    <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white sm:table-cell sm:w-[20%] lg:w-[17%]">
                        Type
                    </TableHead>
                    <TableHead className="hidden px-3 py-3 text-[11px] font-semibold uppercase text-white lg:table-cell lg:w-[31%]">
                        Parts
                    </TableHead>
                    <TableHead className="w-[28%] px-3 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[25%] lg:w-[15%]">
                        Price
                    </TableHead>
                    <TableHead className="w-[34%] px-2 py-3 text-right text-[11px] font-semibold uppercase text-white sm:w-[30%] lg:w-[15%]">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.length > 0 ? (
                    services.map((service) => (
                        <TableRow
                            key={service.id}
                            className="border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-gray-200/80 dark:border-gray-800 dark:odd:bg-gray-900 dark:even:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            <TableCell className="px-3 py-3 align-top">
                                <div className="break-words font-semibold text-gray-900 dark:text-gray-100">
                                    {service.name}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    ID {service.id}
                                </div>
                            </TableCell>
                            <TableCell className="hidden px-3 py-3 align-top text-sm text-gray-600 dark:text-gray-300 sm:table-cell">
                                <span className="block break-words">
                                    {service.service_type}
                                </span>
                            </TableCell>
                            <TableCell
                                className="hidden px-3 py-3 align-top text-sm text-gray-600 dark:text-gray-300 lg:table-cell"
                                title={service.parts}
                            >
                                <span className="block truncate">
                                    {service.parts}
                                </span>
                            </TableCell>
                            <TableCell className="px-3 py-3 text-right align-top font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                                {Number(service.price).toFixed(2)}
                            </TableCell>
                            <TableCell className="px-2 py-3 align-top">
                                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                    <EditServiceDialog service={service} />
                                    <DeleteServiceDialog service={service} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow className="border-0 hover:bg-transparent">
                        <TableCell
                            colSpan={5}
                            className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                            No services found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
);

export default ServiceCard;