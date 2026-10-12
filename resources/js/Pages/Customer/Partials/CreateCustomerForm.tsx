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
        full_name: string;
        email: string;
        phone: string;
        address: string;
    }>({
        full_name: '',
        email: '',
        phone: '',
        address: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const nameParts = form.data.full_name.trim().split(/\s+/).filter(Boolean);
        form.clearErrors();
        if (nameParts.length < 2) {
            form.setError('full_name', 'Enter a first and last name.');
            return;
        }

        form.transform((data) => ({
            name: nameParts[0],
            lastname: nameParts.slice(1).join(' '),
            email: data.email,
            phone: data.phone,
            address: data.address || null,
        }));
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
                    <Button className="bg-[#2563EB] text-white hover:bg-blue-700">
                        Register Customer
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#EFF6FF] p-0 sm:max-w-lg [&>button]:text-blue-100 [&>button]:hover:text-white">
                    <DialogHeader className="rounded-t-xl bg-[#2563EB] px-6 py-5 pr-14 text-left text-white">
                        <DialogTitle className="text-white">
                            Register Customer
                        </DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Enter the customer details below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-4 px-6 py-5">
                        <div>
                            <label htmlFor="create-customer-full-name" className="mb-2 block text-sm font-medium text-slate-800">
                                Full Name
                            </label>
                            <Input
                                onChange={(e) => {
                                    form.setData('full_name', e.target.value);
                                    form.clearErrors('full_name');
                                }}
                                placeholder="Jane Smith"
                                name="full_name"
                                id="create-customer-full-name"
                                autoComplete="name"
                                value={form.data.full_name}
                                type="text"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.full_name}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-email" className="mb-2 block text-sm font-medium text-slate-800">
                                Email Address
                            </label>
                            <Input
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder="customer@example.com"
                                name="email"
                                id="create-customer-email"
                                autoComplete="email"
                                value={form.data.email}
                                type="email"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.email}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-phone" className="mb-2 block text-sm font-medium text-slate-800">
                                Phone Number
                            </label>
                            <Input
                                onChange={(e) => form.setData('phone', e.target.value)}
                                placeholder="(555) 123-4567"
                                name="phone"
                                id="create-customer-phone"
                                autoComplete="tel"
                                value={form.data.phone}
                                type="tel"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.phone}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-address" className="mb-2 block text-sm font-medium text-slate-800">
                                Address
                            </label>
                            <Textarea
                                onChange={(e) => form.setData('address', e.target.value)}
                                name="address"
                                autoComplete="street-address"
                                value={form.data.address || ''}
                                placeholder="Customer address"
                                id="create-customer-address"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.address}
                            </span>
                        </div>

                        <DialogFooter className="gap-3 border-t border-blue-100 bg-white/70 px-6 py-4 sm:flex-row">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                Cancel
                            </Button>
                            <Button disabled={form.processing} type="submit" className="bg-[#2563EB] text-white hover:bg-blue-700">
                                Register Customer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
