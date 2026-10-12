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

export function CreateCustomerForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<{
        name: string;
        lastname: string;
        address: string | null;
    }>({
        name: '',
        lastname: '',
        address: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        form.post(route('customer.store'), {
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
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Create New Customer
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create a new customer</DialogTitle>
                        <DialogDescription>
                            Add the customer details below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="create-customer-name" className="mb-2 block text-sm font-medium">
                                Name:
                            </label>
                            <Input
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Customer name"
                                name="name"
                                id="create-customer-name"
                                value={form.data.name || ''}
                                type="text"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.name}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-lastname" className="mb-2 block text-sm font-medium">
                                Lastname:
                            </label>
                            <Input
                                onChange={(e) => form.setData('lastname', e.target.value)}
                                placeholder="Customer lastname"
                                name="lastname"
                                id="create-customer-lastname"
                                value={form.data.lastname || ''}
                                type="text"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.lastname}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-address" className="mb-2 block text-sm font-medium">
                                Address:
                            </label>
                            <Textarea
                                onChange={(e) => form.setData('address', e.target.value)}
                                name="address"
                                value={form.data.address || ''}
                                placeholder="Customer address"
                                id="create-customer-address"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.address}
                            </span>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button disabled={form.processing} type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
