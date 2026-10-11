import { MakeToastError, MakeToastSuccess } from '@/Components/MakeToast';
import { Button } from '@/Components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
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
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
        >
            <div className="flex items-center justify-end space-x-4 px-4">
                <CollapsibleTrigger className="" asChild>
                    <Button
                        size="sm"
                        variant={'ghost'}
                        className="hover:underline"
                    >
                        <h4 className="text-sm font-semibold">
                            Create New Note
                        </h4>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-2 overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                <h1 className="py-4 text-center text-2xl font-bold tracking-wide">
                    Create New Note
                </h1>
                <form
                    onSubmit={handleSubmit}
                    method="POST"
                    className="space-y-6 px-8"
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

                    <div className="py-5 text-end">
                        <Button
                            disabled={form.processing}
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </CollapsibleContent>
        </Collapsible>
    );
}
