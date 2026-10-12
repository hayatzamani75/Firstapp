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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit company</DialogTitle>
                    <DialogDescription>
                        Update the details for this company.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label
                            htmlFor="edit-company-name"
                            className="mb-2 block text-sm font-medium"
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
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.name}
                        </span>
                    </div>

                    <div>
                        <label
                            htmlFor="edit-company-type"
                            className="mb-2 block text-sm font-medium"
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
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.type}
                        </span>
                    </div>

                    <div>
                        <label
                            htmlFor="edit-company-address"
                            className="mb-2 block text-sm font-medium"
                        >
                            Address:
                        </label>
                        <Textarea
                            onChange={(e) => form.setData('address', e.target.value)}
                            name="address"
                            id="edit-company-address"
                            value={form.data.address || ''}
                            placeholder="Company address"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.address}
                        </span>
                    </div>

                    <DialogFooter>
                        <Button disabled={form.processing} type="submit">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
