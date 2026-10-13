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
import { Internship } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    internship: Internship;
}

export function EditInternshipDialog({ internship }: IProps) {
    const form = useForm<{
        name: string;
        lastname: string;
        phone: string;
        email: string;
        address: string | null;
        contract: string;
    }>({
        name: internship.name || '',
        lastname: internship.lastname || '',
        phone: internship.phone || '',
        email: internship.email || '',
        address: internship.address || null,
        contract: internship.contract || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        form.put(route('internship.update', internship.id), {
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
                <Button variant="outline" size="sm" className="border-violet-200 bg-violet-50 text-[11px] text-violet-700 hover:bg-violet-100">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Edit internship</DialogTitle>
                    <DialogDescription>
                        Update the registration details for this internship.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="edit-internship-name" className="mb-2 block text-sm font-medium">Name:</label>
                        <Input onChange={(e) => form.setData('name', e.target.value)} name="name" id="edit-internship-name" value={form.data.name || ''} type="text" className="bg-gray-50 focus:border-none focus:outline-none" />
                        <span className="text-sm text-red-600">{form.errors.name}</span>
                    </div>

                    <div>
                        <label htmlFor="edit-internship-lastname" className="mb-2 block text-sm font-medium">Lastname:</label>
                        <Input onChange={(e) => form.setData('lastname', e.target.value)} name="lastname" id="edit-internship-lastname" value={form.data.lastname || ''} type="text" className="bg-gray-50 focus:border-none focus:outline-none" />
                        <span className="text-sm text-red-600">{form.errors.lastname}</span>
                    </div>

                    <div>
                        <label htmlFor="edit-internship-phone" className="mb-2 block text-sm font-medium">Phone number:</label>
                        <Input onChange={(e) => form.setData('phone', e.target.value)} name="phone" id="edit-internship-phone" value={form.data.phone || ''} type="tel" className="bg-gray-50 focus:border-none focus:outline-none" />
                        <span className="text-sm text-red-600">{form.errors.phone}</span>
                    </div>

                    <div>
                        <label htmlFor="edit-internship-email" className="mb-2 block text-sm font-medium">Email:</label>
                        <Input onChange={(e) => form.setData('email', e.target.value)} name="email" id="edit-internship-email" value={form.data.email || ''} type="email" className="bg-gray-50 focus:border-none focus:outline-none" />
                        <span className="text-sm text-red-600">{form.errors.email}</span>
                    </div>

                    <div>
                        <label htmlFor="edit-internship-address" className="mb-2 block text-sm font-medium">Address:</label>
                        <Textarea onChange={(e) => form.setData('address', e.target.value)} name="address" id="edit-internship-address" value={form.data.address || ''} className="bg-gray-50 focus:border-none focus:outline-none" />
                        <span className="text-sm text-red-600">{form.errors.address}</span>
                    </div>

                    <div>
                        <label htmlFor="edit-internship-contract" className="mb-2 block text-sm font-medium">Contract:</label>
                        <Input onChange={(e) => form.setData('contract', e.target.value)} name="contract" id="edit-internship-contract" value={form.data.contract || ''} type="text" className="bg-gray-50 focus:border-none focus:outline-none" />
                        <span className="text-sm text-red-600">{form.errors.contract}</span>
                    </div>

                    <DialogFooter>
                        <Button disabled={form.processing} type="submit" className="bg-violet-700 text-white hover:bg-violet-800">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
