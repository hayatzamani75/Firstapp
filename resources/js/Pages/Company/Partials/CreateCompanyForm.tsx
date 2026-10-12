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

export function CreateCompanyForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<{
        name: string;
        type: string;
        address: string | null;
    }>({
        name: '',
        type: '',
        address: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        form.post(route('company.store'), {
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
                        Create New Company
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#EFF6FF] p-0 sm:max-w-lg [&>button]:text-blue-100 [&>button]:hover:text-white">
                    <DialogHeader className="rounded-t-xl bg-blue-700 px-6 py-5 pr-14 text-left text-white">
                        <DialogTitle className="text-white">Create a new company</DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Add the company details below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-4 px-6 py-5">
                        <div>
                            <label
                                htmlFor="create-company-name"
                                className="mb-2 block text-sm font-medium text-slate-800"
                            >
                                Name:
                            </label>
                            <Input
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Company name"
                                name="name"
                                id="create-company-name"
                                value={form.data.name || ''}
                                type="text"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.name}
                            </span>
                        </div>

                        <div>
                            <label
                                htmlFor="create-company-type"
                                className="mb-2 block text-sm font-medium text-slate-800"
                            >
                                Type:
                            </label>
                            <Input
                                onChange={(e) => form.setData('type', e.target.value)}
                                placeholder="Company type"
                                name="type"
                                id="create-company-type"
                                value={form.data.type || ''}
                                type="text"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.type}
                            </span>
                        </div>

                        <div>
                            <label
                                htmlFor="create-company-address"
                                className="mb-2 block text-sm font-medium text-slate-800"
                            >
                                Address:
                            </label>
                            <Textarea
                                onChange={(e) => form.setData('address', e.target.value)}
                                name="address"
                                value={form.data.address || ''}
                                placeholder="Company address"
                                id="create-company-address"
                                className="border-blue-200 bg-white focus-visible:ring-blue-500"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.address}
                            </span>
                        </div>

                        <DialogFooter className="gap-3 border-t border-blue-100 bg-white/70 px-6 py-4 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={form.processing}
                                type="submit"
                                className="bg-blue-700 text-white hover:bg-blue-800"
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
