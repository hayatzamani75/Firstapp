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
import { Company } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    company: Company;
}

export function EditCompanyDialog({ company }: IProps) {
    const form = useForm<{
        name: string;
        type: string;
        address: string | null;
    }>({
        name: company.name || '',
        type: company.type || '',
        address: company.address || null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        form.put(route('company.update', company.id), {
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
                <Button variant="outline" size="sm" className="text-[11px]">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#EFF6FF] p-0 sm:max-w-lg [&>button]:text-blue-100 [&>button]:hover:text-white">
                <DialogHeader className="rounded-t-xl bg-blue-700 px-6 py-5 pr-14 text-left text-white">
                    <DialogTitle className="text-white">Edit company</DialogTitle>
                    <DialogDescription className="text-blue-100">
                        Update the details for this company.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} method="POST" className="space-y-4 px-6 py-5">
                    <div>
                        <label
                            htmlFor="edit-company-name"
                            className="mb-2 block text-sm font-medium text-slate-800"
                        >
                            Name:
                        </label>
                        <Input
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Company name"
                            name="name"
                            id="edit-company-name"
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
                            htmlFor="edit-company-type"
                            className="mb-2 block text-sm font-medium text-slate-800"
                        >
                            Type:
                        </label>
                        <Input
                            onChange={(e) => form.setData('type', e.target.value)}
                            placeholder="Company type"
                            name="type"
                            id="edit-company-type"
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
                            htmlFor="edit-company-address"
                            className="mb-2 block text-sm font-medium text-slate-800"
                        >
                            Address:
                        </label>
                        <Textarea
                            onChange={(e) => form.setData('address', e.target.value)}
                            name="address"
                            id="edit-company-address"
                            value={form.data.address || ''}
                            placeholder="Company address"
                            className="border-blue-200 bg-white focus-visible:ring-blue-500"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.address}
                        </span>
                    </div>

                    <DialogFooter className="gap-3 border-t border-blue-100 bg-white/70 px-6 py-4 sm:flex-row">
                        <Button disabled={form.processing} type="submit" className="bg-blue-700 text-white hover:bg-blue-800">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
