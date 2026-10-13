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

export function CreateNoteForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const form = useForm<{
        title: string;
        description: string | null;
    }>({
        title: '',
        description: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.description === '') form.setData('description', null);
        form.post(route('note.store'), {
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
                        Create New Note
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#F8FAFC] p-0 sm:max-w-lg">
                    <DialogHeader className="rounded-t-xl bg-blue-700 px-4 py-4 text-left text-white sm:px-6">
                        <DialogTitle className="text-white">Create a new note</DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Add a title and description for your note.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} method="POST" className="space-y-4 px-4 py-5 sm:px-6">
                        <div>
                            <label
                                htmlFor="create-title"
                                className="mb-2 block text-sm font-medium"
                            >
                                Title:
                            </label>
                            <Input
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                placeholder="Title"
                                name="title"
                                id="create-title"
                                value={form.data.title || ''}
                                type="text"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.title}
                            </span>
                        </div>

                        <div>
                            <label
                                htmlFor="create-description"
                                className="mb-2 block text-sm font-medium"
                            >
                                Description:
                            </label>
                            <Textarea
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                name="description"
                                value={form.data.description || ''}
                                placeholder="Type your description."
                                id="create-description"
                                className="bg-gray-50 focus:border-none focus:outline-none"
                            />
                            <span className="text-sm text-red-600 dark:text-red-400">
                                {form.errors.description}
                            </span>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={form.processing}
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
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
