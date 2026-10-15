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
        email: string;
        phone: string;
        password: string;
        password_confirmation: string;
        address: string;
    }>({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        address: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            phone: data.phone || null,
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
                            Enter the customer details and login credentials.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-4 px-6 py-5">
                        <div>
                            <label htmlFor="create-customer-name" className="mb-2 block text-sm font-medium text-slate-800">
                                First name
                            </label>
                            <Input
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Jane"
                                name="name"
                                id="create-customer-name"
                                autoComplete="given-name"
                                value={form.data.name}
                                type="text"
                                required
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.name}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-lastname" className="mb-2 block text-sm font-medium text-slate-800">
                                Last name
                            </label>
                            <Input id="create-customer-lastname" name="lastname" value={form.data.lastname} onChange={(e) => form.setData('lastname', e.target.value)} autoComplete="family-name" required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.lastname}</span>
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
                                required
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.email}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-phone" className="mb-2 block text-sm font-medium text-slate-800">
                                Phone (optional)
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
                            <label htmlFor="create-customer-password" className="mb-2 block text-sm font-medium text-slate-800">
                                Password
                            </label>
                            <Input id="create-customer-password" type="password" name="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} autoComplete="new-password" required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.password}</span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-password-confirmation" className="mb-2 block text-sm font-medium text-slate-800">
                                Confirm password
                            </label>
                            <Input id="create-customer-password-confirmation" type="password" name="password_confirmation" value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} autoComplete="new-password" required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">{form.errors.password_confirmation}</span>
                        </div>

                        <div>
                            <label htmlFor="create-customer-address" className="mb-2 block text-sm font-medium text-slate-800">
                                Address (optional)
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
