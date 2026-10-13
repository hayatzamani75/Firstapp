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

type InternshipFormData = {
    name: string;
    lastname: string;
    phone: string;
    email: string;
    address: string;
    contract: string;
};

export function CreateInternshipForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<InternshipFormData>({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        address: '',
        contract: '',
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            address: data.address || null,
        }));

        form.post(route('internship.store'), {
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
                    <Button className="bg-violet-700 text-white shadow-lg shadow-violet-200 hover:bg-violet-800">
                        Register Internship
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border-violet-200 bg-violet-50 p-0 sm:max-w-xl [&>button]:text-violet-100 [&>button]:hover:text-white">
                    <DialogHeader className="rounded-t-2xl bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-5 pr-14 text-left text-white">
                        <DialogTitle className="text-white">Register internship</DialogTitle>
                        <DialogDescription className="text-violet-100">
                            Fill in the details for the internship registration form.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                        <div>
                            <label htmlFor="internship-name" className="mb-2 block text-sm font-medium text-slate-800">
                                First name
                            </label>
                            <Input id="internship-name" value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} autoComplete="given-name" maxLength={255} required className="border-violet-200 bg-white focus-visible:ring-violet-500" />
                            <span className="text-sm text-red-600">{form.errors.name}</span>
                        </div>

                        <div>
                            <label htmlFor="internship-lastname" className="mb-2 block text-sm font-medium text-slate-800">
                                Last name
                            </label>
                            <Input id="internship-lastname" value={form.data.lastname} onChange={(event) => form.setData('lastname', event.target.value)} autoComplete="family-name" maxLength={255} required className="border-violet-200 bg-white focus-visible:ring-violet-500" />
                            <span className="text-sm text-red-600">{form.errors.lastname}</span>
                        </div>

                        <div>
                            <label htmlFor="internship-phone" className="mb-2 block text-sm font-medium text-slate-800">
                                Phone number
                            </label>
                            <Input id="internship-phone" value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} autoComplete="tel" type="tel" inputMode="numeric" pattern="[0-9]{10,14}" maxLength={14} placeholder="10-14 digits" required className="border-violet-200 bg-white focus-visible:ring-violet-500" />
                            <span className="text-sm text-red-600">{form.errors.phone}</span>
                        </div>

                        <div>
                            <label htmlFor="internship-email" className="mb-2 block text-sm font-medium text-slate-800">
                                Email address
                            </label>
                            <Input id="internship-email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} autoComplete="email" type="email" maxLength={255} required className="border-violet-200 bg-white focus-visible:ring-violet-500" />
                            <span className="text-sm text-red-600">{form.errors.email}</span>
                        </div>

                        <div>
                            <label htmlFor="internship-address" className="mb-2 block text-sm font-medium text-slate-800">
                                Address
                            </label>
                            <Textarea id="internship-address" value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} autoComplete="street-address" maxLength={1000} className="border-violet-200 bg-white focus-visible:ring-violet-500" />
                            <span className="text-sm text-red-600">{form.errors.address}</span>
                        </div>

                        <div>
                            <label htmlFor="internship-contract" className="mb-2 block text-sm font-medium text-slate-800">
                                Contract
                            </label>
                            <Input id="internship-contract" value={form.data.contract} onChange={(event) => form.setData('contract', event.target.value)} maxLength={255} placeholder="Full-time, Part-time, Remote" required className="border-violet-200 bg-white focus-visible:ring-violet-500" />
                            <span className="text-sm text-red-600">{form.errors.contract}</span>
                        </div>

                        <DialogFooter className="gap-3 border-t border-violet-200 bg-white/70 px-6 py-4 sm:flex-row">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-violet-200 text-violet-700 hover:bg-violet-50">
                                Cancel
                            </Button>
                            <Button disabled={form.processing} type="submit" className="bg-violet-700 text-white hover:bg-violet-800">
                                Save internship
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
