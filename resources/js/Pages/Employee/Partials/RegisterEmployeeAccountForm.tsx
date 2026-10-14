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
import { useForm } from '@inertiajs/react';
import * as React from 'react';

type EmployeeAccountFormData = {
    name: string;
    lastname: string;
    username: string;
    password: string;
    password_confirmation: string;
};

export function RegisterEmployeeAccountForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<EmployeeAccountFormData>({
        name: '',
        lastname: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    function closeDialog() {
        setIsOpen(false);
        form.reset();
        form.clearErrors();
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(route('employee.account.store'), {
            preserveScroll: true,
            onSuccess: (response) => {
                const flash = response.props.flash;
                closeDialog();

                if (flash.error) return MakeToastError(flash.error);
                return MakeToastSuccess(
                    flash.success ?? 'Employee account created successfully.',
                );
            },
            onError: () => {
                if (!Object.keys(form.errors).length) {
                    MakeToastError('The employee account could not be created.');
                }
            },
        });
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => (open ? setIsOpen(true) : closeDialog())}
        >
            <DialogTrigger asChild>
                <Button className="bg-blue-700 text-white hover:bg-blue-800">
                    Register employee
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#EFF6FF] p-0 sm:max-w-lg [&>button]:text-blue-100 [&>button]:hover:text-white">
                <DialogHeader className="rounded-t-xl bg-blue-700 px-6 py-5 pr-14 text-left text-white">
                    <DialogTitle className="text-white">
                        Register employee account
                    </DialogTitle>
                    <DialogDescription className="text-blue-100">
                        The new employee can add, edit and delete products.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5" noValidate>
                    <div>
                        <label htmlFor="employee-account-name" className="mb-2 block text-sm font-medium text-slate-800">
                            Name
                        </label>
                        <Input
                            id="employee-account-name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                            autoComplete="given-name"
                            maxLength={255}
                            required
                            className="border-blue-200 bg-white focus-visible:ring-blue-500"
                        />
                        {form.errors.name && (
                            <p className="mt-1 text-sm text-red-600">{form.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="employee-account-lastname" className="mb-2 block text-sm font-medium text-slate-800">
                            Last name
                        </label>
                        <Input
                            id="employee-account-lastname"
                            value={form.data.lastname}
                            onChange={(event) => form.setData('lastname', event.target.value)}
                            autoComplete="family-name"
                            maxLength={255}
                            required
                            className="border-blue-200 bg-white focus-visible:ring-blue-500"
                        />
                        {form.errors.lastname && (
                            <p className="mt-1 text-sm text-red-600">{form.errors.lastname}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="employee-account-username" className="mb-2 block text-sm font-medium text-slate-800">
                            Username
                        </label>
                        <Input
                            id="employee-account-username"
                            value={form.data.username}
                            onChange={(event) => form.setData('username', event.target.value)}
                            autoComplete="off"
                            maxLength={50}
                            required
                            placeholder="e.g. ahmad.zamani"
                            className="border-blue-200 bg-white focus-visible:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Used to log in. Letters, numbers, dots, dashes and underscores only.
                        </p>
                        {form.errors.username && (
                            <p className="mt-1 text-sm text-red-600">{form.errors.username}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="employee-account-password" className="mb-2 block text-sm font-medium text-slate-800">
                            Password
                        </label>
                        <Input
                            id="employee-account-password"
                            type="password"
                            value={form.data.password}
                            onChange={(event) => form.setData('password', event.target.value)}
                            autoComplete="new-password"
                            required
                            className="border-blue-200 bg-white focus-visible:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">At least 8 characters.</p>
                        {form.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="employee-account-password-confirmation" className="mb-2 block text-sm font-medium text-slate-800">
                            Retype password
                        </label>
                        <Input
                            id="employee-account-password-confirmation"
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={(event) =>
                                form.setData('password_confirmation', event.target.value)
                            }
                            autoComplete="new-password"
                            required
                            className="border-blue-200 bg-white focus-visible:ring-blue-500"
                        />
                        {form.errors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">
                                {form.errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-3 border-t border-blue-100 bg-white/70 px-6 py-4 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialog}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={form.processing}
                            type="submit"
                            className="bg-blue-700 text-white hover:bg-blue-800"
                        >
                            {form.processing ? 'Saving…' : 'Register employee'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
