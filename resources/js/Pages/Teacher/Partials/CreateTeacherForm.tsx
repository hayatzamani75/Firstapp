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

export function CreateTeacherForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<{
        name: string;
        lastname: string;
        position: string;
        address: string | null;
    }>({
        name: '',
        lastname: '',
        position: '',
        address: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.address === '') form.setData('address', null);
        form.post(route('teacher.store'), {
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
                        Create New Teacher
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create a new teacher</DialogTitle>
                        <DialogDescription>
                            Add the teacher details below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="create-teacher-name" className="mb-2 block text-sm font-medium">
                                Name:
                            </label>
                            <Input
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder="Teacher name"
                                name="name"
                                id="create-teacher-name"
                                value={form.data.name || ''}
                                type="text"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.name}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-teacher-lastname" className="mb-2 block text-sm font-medium">
                                Lastname:
                            </label>
                            <Input
                                onChange={(e) => form.setData('lastname', e.target.value)}
                                placeholder="Teacher lastname"
                                name="lastname"
                                id="create-teacher-lastname"
                                value={form.data.lastname || ''}
                                type="text"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.lastname}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-teacher-position" className="mb-2 block text-sm font-medium">
                                Position:
                            </label>
                            <Input
                                onChange={(e) => form.setData('position', e.target.value)}
                                placeholder="Teacher position"
                                name="position"
                                id="create-teacher-position"
                                value={form.data.position || ''}
                                type="text"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.position}
                            </span>
                        </div>

                        <div>
                            <label htmlFor="create-teacher-address" className="mb-2 block text-sm font-medium">
                                Address:
                            </label>
                            <Textarea
                                onChange={(e) => form.setData('address', e.target.value)}
                                name="address"
                                value={form.data.address || ''}
                                placeholder="Teacher address"
                                id="create-teacher-address"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.address}
                            </span>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button disabled={form.processing} type="submit" className="bg-blue-600 hover:bg-blue-700">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
