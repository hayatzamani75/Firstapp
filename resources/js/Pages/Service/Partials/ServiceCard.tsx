import { Service } from '@/types';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { EditServiceDialog } from './EditServiceDialog';

interface IProps {
    services: Service[];
}

const ServiceCard = ({ services }: IProps) => (
    <>
        {services.length > 0 ? (
            <div className="space-y-3">
                {services.map((service) => (
                    <div key={service.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{service.service_type}</div>
                                <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{service.name}</h3>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{service.parts}</p>
                                <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">Price: {Number(service.price).toFixed(2)}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <EditServiceDialog service={service} />
                                <DeleteServiceDialog service={service} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <span className="block py-6 text-center text-sm text-slate-500 dark:text-slate-400">No services found.</span>
        )}
    </>
);

export default ServiceCard;