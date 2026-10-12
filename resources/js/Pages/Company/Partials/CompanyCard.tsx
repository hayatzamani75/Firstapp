import { Company } from '@/types';
import { DeleteCompanyDialog } from './DeleteCompanyDialog';
import { EditCompanyDialog } from './EditCompanyDialog';

interface IProps {
    companies: Company[];
}

const CompanyCard = ({ companies }: IProps) => {
    return (
        <>
            {companies.length > 0 ? (
                <div className="space-y-3">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                                        Company
                                    </div>
                                    <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {company.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {company.type}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                                        {company.address || 'No address added yet.'}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <EditCompanyDialog company={company} />
                                    <DeleteCompanyDialog company={company} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="block py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No companies found.
                </span>
            )}
        </>
    );
};

export default CompanyCard;
