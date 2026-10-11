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
import { Note } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    note: Note;
}

export function EditDialog({ note }: IProps) {
    const form = useForm<{
        title: string;
        description: string | null;
    }>({
        title: note.title || '',
        description: note.description || null,
    });
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.description === '') form.setData('description', null);
        form.put(route('note.update', note.id), {
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
                <Button variant="outline" size={'sm'} className="text-[11px]">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit note</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    method="POST"
                    className="space-y-6"
                >
                    <div className="">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium"
                        >
                            Title:
                        </label>
                        <Input
                            onChange={(e) =>
                                form.setData('title', e.target.value)
                            }
                            placeholder="Title"
                            name="title"
                            id="title"
                            value={form.data.title || ''}
                            type="text"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.title}
                        </span>
                    </div>

                    <div className="">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium"
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
                            id="description"
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.description}
                        </span>
                    </div>

                    {/* <div className="py-5 text-end">
                        <Button
                            disabled={form.processing}
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Create
                        </Button>
                    </div> */}
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
