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

type EmployeeFormData = {
    name: string;
    lastname: string;
    password: string;
    password_confirmation: string;
    phone: string;
    email: string;
    address: string;
};

export function CreateEmployeeForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<EmployeeFormData>({
        name: '',
        lastname: '',
        password: '',
        password_confirmation: '',
        phone: '',
        email: '',
        address: '',
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            address: data.address || null,
        }));
        form.post(route('employee.store'), {
            preserveState: false,
            onSuccess: (response) => {
                const flash = response.props.flash;
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
                    <Button className="bg-blue-700 text-white hover:bg-blue-800">
                        Add Employee
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#EFF6FF] p-0 sm:max-w-lg [&>button]:text-blue-100 [&>button]:hover:text-white">
                    <DialogHeader className="rounded-t-xl bg-blue-700 px-6 py-5 pr-14 text-left text-white">
                        <DialogTitle className="text-white">Add employee</DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Enter the employee contact details.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label htmlFor="employee-name" className="mb-2 block text-sm font-medium text-slate-800">
                                First name
                            </label>
                            <Input id="employee-name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} autoComplete="given-name" maxLength={255} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.name}</span>
                        </div>

                        <div>
                            <label htmlFor="employee-lastname" className="mb-2 block text-sm font-medium text-slate-800">
                                Last name
                            </label>
                            <Input id="employee-lastname" value={form.data.lastname} onChange={(event) => form.setData('lastname', event.target.value)} autoComplete="family-name" maxLength={255} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.lastname}</span>
                        </div>

                        <div>
                            <label htmlFor="employee-password" className="mb-2 block text-sm font-medium text-slate-800">
                                Password
                            </label>
                            <Input id="employee-password" type="password" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} autoComplete="new-password" required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.password}</span>
                        </div>

                        <div>
                            <label htmlFor="employee-password-confirmation" className="mb-2 block text-sm font-medium text-slate-800">
                                Confirm password
                            </label>
                            <Input id="employee-password-confirmation" type="password" value={form.data.password_confirmation} onChange={(event) => form.setData('password_confirmation', event.target.value)} autoComplete="new-password" required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.password_confirmation}</span>
                        </div>

                        <div>
                            <label htmlFor="employee-phone" className="mb-2 block text-sm font-medium text-slate-800">
                                Phone number
                            </label>
                            <Input id="employee-phone" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} autoComplete="tel" type="tel" inputMode="numeric" pattern="[0-9]{10,14}" maxLength={14} placeholder="10-14 digits" required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.phone}</span>
                        </div>

                        <div>
                            <label htmlFor="employee-email" className="mb-2 block text-sm font-medium text-slate-800">
                                Email address
                            </label>
                            <Input id="employee-email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoComplete="email" type="email" maxLength={255} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.email}</span>
                        </div>

                        <div>
                            <label htmlFor="employee-address" className="mb-2 block text-sm font-medium text-slate-800">
                                Address
                            </label>
                            <Textarea id="employee-address" value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} autoComplete="street-address" maxLength={1000} className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                            <span className="text-sm text-red-600">{form.errors.address}</span>
                        </div>

                        <DialogFooter className="gap-3 border-t border-blue-100 bg-white/70 px-6 py-4 sm:flex-row">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                Cancel
                            </Button>
                            <Button disabled={form.processing} type="submit" className="bg-blue-700 text-white hover:bg-blue-800">
                                Save employee
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
