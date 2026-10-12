import { MakeToastError, MakeToastSuccess } from '@/Components/MakeToast';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Service } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    service: Service;
}

export function EditServiceDialog({ service }: IProps) {
    const form = useForm({
        name: service.name,
        service_type: service.service_type,
        parts: service.parts,
        price: service.price,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put(route('service.update', service.id), {
            preserveState: false,
            onSuccess: (res) => {
                const flash = res.props.flash;
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-[11px]">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit service</DialogTitle>
                    <DialogDescription>Update the details for this service.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor={`edit-service-name-${service.id}`} className="mb-2 block text-sm font-medium">Name:</label>
                        <Input id={`edit-service-name-${service.id}`} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        <span className="text-sm text-red-600 dark:text-red-400">{form.errors.name}</span>
                    </div>
                    <div>
                        <label htmlFor={`edit-service-type-${service.id}`} className="mb-2 block text-sm font-medium">Service type:</label>
                        <Input id={`edit-service-type-${service.id}`} value={form.data.service_type} onChange={(e) => form.setData('service_type', e.target.value)} />
                        <span className="text-sm text-red-600 dark:text-red-400">{form.errors.service_type}</span>
                    </div>
                    <div>
                        <label htmlFor={`edit-service-parts-${service.id}`} className="mb-2 block text-sm font-medium">Parts:</label>
                        <Textarea id={`edit-service-parts-${service.id}`} value={form.data.parts} onChange={(e) => form.setData('parts', e.target.value)} />
                        <span className="text-sm text-red-600 dark:text-red-400">{form.errors.parts}</span>
                    </div>
                    <div>
                        <label htmlFor={`edit-service-price-${service.id}`} className="mb-2 block text-sm font-medium">Price:</label>
                        <Input id={`edit-service-price-${service.id}`} type="number" min="0" step="0.01" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} />
                        <span className="text-sm text-red-600 dark:text-red-400">{form.errors.price}</span>
                    </div>
                    <DialogFooter>
                        <Button disabled={form.processing} type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}