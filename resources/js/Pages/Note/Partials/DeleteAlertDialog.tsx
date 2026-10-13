import { MakeToastError, MakeToastSuccess } from '@/Components/MakeToast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Note } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    note: Note;
}

export function DeleteAlertDialog({ note }: IProps) {
    const form = useForm();
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.delete(route('note.destroy', note.id), {
            preserveState: false,
            onSuccess: (res) => {
                const flash = res.props.flash;
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={'sm'} className="h-8 px-2.5 text-[10px] font-medium text-white bg-red-600 hover:bg-red-700 focus-visible:ring-red-600">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} className="bg-red-600 text-white hover:bg-red-700">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
