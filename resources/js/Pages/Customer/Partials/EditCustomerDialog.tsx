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
import { Customer } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    customer: Customer;
}

export function EditCustomerDialog({ customer }: IProps) {
    const form = useForm<{
        name: string;
        lastname: string;
        email: string;
        phone: string;
        address: string | null;
    }>({
        name: customer.name || '',
        lastname: customer.lastname || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        if (form.data.phone === '') form.setData('phone', '');
        form.put(route('customer.update', customer.id), {
            preserveState: false,
            onSuccess: (res) => {
                const flash = res.props.flash;
                form.reset();
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-[11px] bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit customer</DialogTitle>
                    <DialogDescription>
                        Update the details for this customer.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="edit-customer-name" className="mb-2 block text-sm font-medium">
                            Name:
                        </label>
                        <Input
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Customer name"
                            name="name"
                            id="edit-customer-name"
                            value={form.data.name || ''}
                            type="text"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.name}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-customer-lastname" className="mb-2 block text-sm font-medium">
                            Lastname:
                        </label>
                        <Input
                            onChange={(e) => form.setData('lastname', e.target.value)}
                            placeholder="Customer lastname"
                            name="lastname"
                            id="edit-customer-lastname"
                            value={form.data.lastname || ''}
                            type="text"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.lastname}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-customer-email" className="mb-2 block text-sm font-medium">
                            Email:
                        </label>
                        <Input
                            onChange={(e) => form.setData('email', e.target.value)}
                            placeholder="customer@example.com"
                            name="email"
                            id="edit-customer-email"
                            value={form.data.email}
                            type="email"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.email}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-customer-phone" className="mb-2 block text-sm font-medium">
                            Phone Number:
                        </label>
                        <Input
                            onChange={(e) => form.setData('phone', e.target.value)}
                            placeholder="(555) 123-4567"
                            name="phone"
                            id="edit-customer-phone"
                            value={form.data.phone}
                            type="tel"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.phone}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-customer-address" className="mb-2 block text-sm font-medium">
                            Address:
                        </label>
                        <Textarea
                            onChange={(e) => form.setData('address', e.target.value)}
                            name="address"
                            id="edit-customer-address"
                            value={form.data.address || ''}
                            placeholder="Customer address"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.address}
                        </span>
                    </div>

                    <DialogFooter>
                        <Button disabled={form.processing} type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
