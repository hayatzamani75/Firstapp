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
import { Teacher } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    teacher: Teacher;
}

export function DeleteTeacherDialog({ teacher }: IProps) {
    const form = useForm();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.delete(route('teacher.destroy', teacher.id), {
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
                <Button size="sm" className="text-[11px]">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this teacher.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
