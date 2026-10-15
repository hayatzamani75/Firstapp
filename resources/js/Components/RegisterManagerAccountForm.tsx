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
import { FormEvent, useState } from 'react';

type ManagerFormData = {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
};

export default function RegisterManagerAccountForm() {
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<ManagerFormData>({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
    });

    function closeDialog() {
        setIsOpen(false);
        form.reset();
        form.clearErrors();
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(route('manager.account.store'), {
            preserveScroll: true,
            onSuccess: (response) => {
                const flash = response.props.flash;
                closeDialog();
                if (flash.error) return MakeToastError(flash.error);
                MakeToastSuccess(flash.success ?? 'Manager account created.');
            },
            onError: () => {
                if (!Object.keys(form.errors).length) {
                    MakeToastError('The manager account could not be created.');
                }
            },
        });
    }

    const fields: { key: keyof ManagerFormData; label: string; type?: string; autoComplete?: string }[] = [
        { key: 'name', label: 'Name', autoComplete: 'given-name' },
        { key: 'lastname', label: 'Last name', autoComplete: 'family-name' },
        { key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { key: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
        { key: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : closeDialog())}>
            <DialogTrigger asChild>
                <Button type="button" className="w-full justify-start bg-blue-700 text-white hover:bg-blue-800">
                    Register manager
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-white p-0 sm:max-w-lg">
                <DialogHeader className="rounded-t-xl bg-blue-700 px-6 py-5 pr-14 text-left text-white">
                    <DialogTitle className="text-white">Register manager account</DialogTitle>
                    <DialogDescription className="text-blue-100">The manager can sign in and access the management dashboard.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 px-6 py-5" noValidate>
                    {fields.map(({ key, label, type = 'text', autoComplete }) => (
                        <div key={key}>
                            <label htmlFor={`manager-${key}`} className="mb-2 block text-sm font-medium text-slate-800">{label}</label>
                            <Input
                                id={`manager-${key}`}
                                type={type}
                                autoComplete={autoComplete}
                                value={form.data[key]}
                                onChange={(event) => form.setData(key, event.target.value)}
                                required
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            {form.errors[key] && <p className="mt-1 text-sm text-red-600">{form.errors[key]}</p>}
                        </div>
                    ))}
                    <DialogFooter className="gap-3 border-t border-blue-100 bg-slate-50 px-6 py-4 sm:flex-row">
                        <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                        <Button type="submit" disabled={form.processing} className="bg-blue-700 text-white hover:bg-blue-800">
                            {form.processing ? 'Saving…' : 'Register manager'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
