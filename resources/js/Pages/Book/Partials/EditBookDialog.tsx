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
import { Book } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    book: Book;
}

export function EditBookDialog({ book }: IProps) {
    const form = useForm<{
        name: string;
        title: string;
        description: string | null;
    }>({
        name: book.name || '',
        title: book.title || '',
        description: book.description || null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.data.description === '') form.setData('description', null);
        form.put(route('book.update', book.id), {
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
                    <DialogTitle>Edit book</DialogTitle>
                    <DialogDescription>
                        Update the details for this book.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} method="POST" className="space-y-6">
                    <div>
                        <label
                            htmlFor="edit-book-name"
                            className="mb-2 block text-sm font-medium"
                        >
                            Name:
                        </label>
                        <Input
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Book name"
                            name="name"
                            id="edit-book-name"
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
                            htmlFor="edit-book-title"
                            className="mb-2 block text-sm font-medium"
                        >
                            Title:
                        </label>
                        <Input
                            onChange={(e) => form.setData('title', e.target.value)}
                            placeholder="Book title"
                            name="title"
                            id="edit-book-title"
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
                            htmlFor="edit-book-description"
                            className="mb-2 block text-sm font-medium"
                        >
                            Description:
                        </label>
                        <Textarea
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            name="description"
                            id="edit-book-description"
                            value={form.data.description || ''}
                            placeholder="Type the book description."
                            className="bg-gray-50 focus:border-none focus:outline-none"
                        />
                        <span className="text-sm text-red-600 dark:text-red-400">
                            {form.errors.description}
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
