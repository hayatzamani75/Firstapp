import { Customer } from '@/types';
import { DeleteCustomerDialog } from './DeleteCustomerDialog';
import { EditCustomerDialog } from './EditCustomerDialog';

interface IProps {
    customers: Customer[];
}

const CustomerCard = ({ customers }: IProps) => {
    return (
        <>
            {customers.length > 0 ? (
                <div className="space-y-3">
                    {customers.map((customer) => (
                        <div
                            key={customer.id}
                            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                                        Customer
                                    </div>
                                    <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {customer.name} {customer.lastname}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {customer.email}
                                    </p>
                                    {customer.phone && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                            {customer.phone}
                                        </p>
                                    )}
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                                        {customer.address || 'No address added yet.'}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <EditCustomerDialog customer={customer} />
                                    <DeleteCustomerDialog customer={customer} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="block py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No customers found.
                </span>
            )}
        </>
    );
};

export default CustomerCard;
