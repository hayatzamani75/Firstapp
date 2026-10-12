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
import { useForm } from '@inertiajs/react';
import * as React from 'react';

export function CreateServiceForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm({
        name: '',
        service_type: '',
        parts: '',
        price: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(route('service.store'), {
            preserveState: false,
            onSuccess: (res) => {
                const flash = res.props.flash;
                form.reset();
                setIsOpen(false);
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }

    return (
        <div className="flex justify-end">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        Create New Service
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create a new service</DialogTitle>
                        <DialogDescription>Add the service details below.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="create-service-name" className="mb-2 block text-sm font-medium">Name:</label>
                            <Input id="create-service-name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Service name" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.name}</span>
                        </div>
                        <div>
                            <label htmlFor="create-service-type" className="mb-2 block text-sm font-medium">Service type:</label>
                            <Input id="create-service-type" value={form.data.service_type} onChange={(e) => form.setData('service_type', e.target.value)} placeholder="Service type" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.service_type}</span>
                        </div>
                        <div>
                            <label htmlFor="create-service-parts" className="mb-2 block text-sm font-medium">Parts:</label>
                            <Textarea id="create-service-parts" value={form.data.parts} onChange={(e) => form.setData('parts', e.target.value)} placeholder="Parts included" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.parts}</span>
                        </div>
                        <div>
                            <label htmlFor="create-service-price" className="mb-2 block text-sm font-medium">Price:</label>
                            <Input id="create-service-price" type="number" min="0" step="0.01" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} placeholder="0.00" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.price}</span>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button disabled={form.processing} type="submit" className="bg-blue-600 hover:bg-blue-700">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}