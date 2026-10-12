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
import { Teacher } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    teacher: Teacher;
}

export function EditTeacherDialog({ teacher }: IProps) {
    const form = useForm<{
        name: string;
        lastname: string;
        position: string;
        email: string;
        phone_number_1: string;
        phone_number_2: string;
        address: string | null;
    }>({
        name: teacher.name || '',
        lastname: teacher.lastname || '',
        position: teacher.position || '',
        email: teacher.email || '',
        phone_number_1: teacher.phone_number_1 || '',
        phone_number_2: teacher.phone_number_2 || '',
        address: teacher.address || null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        form.put(route('teacher.update', teacher.id), {
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
                    <DialogTitle>Edit teacher</DialogTitle>
                    <DialogDescription>
                        Update the details for this teacher.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="edit-teacher-name" className="mb-2 block text-sm font-medium">
                            Name:
                        </label>
                        <Input
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Teacher name"
                            name="name"
                            id="edit-teacher-name"
                            value={form.data.name || ''}
                            type="text"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.name}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-teacher-lastname" className="mb-2 block text-sm font-medium">
                            Lastname:
                        </label>
                        <Input
                            onChange={(e) => form.setData('lastname', e.target.value)}
                            placeholder="Teacher lastname"
                            name="lastname"
                            id="edit-teacher-lastname"
                            value={form.data.lastname || ''}
                            type="text"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.lastname}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-teacher-position" className="mb-2 block text-sm font-medium">
                            Position:
                        </label>
                        <Input
                            onChange={(e) => form.setData('position', e.target.value)}
                            placeholder="Teacher position"
                            name="position"
                            id="edit-teacher-position"
                            value={form.data.position || ''}
                            type="text"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.position}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-teacher-email" className="mb-2 block text-sm font-medium">
                            Email:
                        </label>
                        <Input
                            onChange={(e) => form.setData('email', e.target.value)}
                            placeholder="teacher@example.com"
                            name="email"
                            id="edit-teacher-email"
                            value={form.data.email}
                            type="email"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.email}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-teacher-address" className="mb-2 block text-sm font-medium">
                            Address:
                        </label>
                        <Textarea
                            onChange={(e) => form.setData('address', e.target.value)}
                            name="address"
                            id="edit-teacher-address"
                            value={form.data.address || ''}
                            placeholder="Teacher address"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.address}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-teacher-phone-number-1" className="mb-2 block text-sm font-medium">
                            Phone Number 1:
                        </label>
                        <Input
                            onChange={(e) => form.setData('phone_number_1', e.target.value)}
                            placeholder="10–14 digits"
                            name="phone_number_1"
                            id="edit-teacher-phone-number-1"
                            value={form.data.phone_number_1}
                            type="tel"
                            inputMode="numeric"
                            maxLength={14}
                            pattern="[0-9]{10,14}"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.phone_number_1}
                        </span>
                    </div>

                    <div>
                        <label htmlFor="edit-teacher-phone-number-2" className="mb-2 block text-sm font-medium">
                            Phone Number 2:
                        </label>
                        <Input
                            onChange={(e) => form.setData('phone_number_2', e.target.value)}
                            placeholder="10–14 digits"
                            name="phone_number_2"
                            id="edit-teacher-phone-number-2"
                            value={form.data.phone_number_2}
                            type="tel"
                            inputMode="numeric"
                            maxLength={14}
                            pattern="[0-9]{10,14}"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.phone_number_2}
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
