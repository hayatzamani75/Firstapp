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
import { Employee } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    employee: Employee;
}

export function DeleteEmployeeDialog({ employee }: IProps) {
    const form = useForm();

    function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        form.delete(route('employee.destroy', employee.id), {
            preserveState: false,
            onSuccess: (response) => {
                const flash = response.props.flash;
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" className="bg-red-600 text-[11px] text-white hover:bg-red-700">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this employee?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The employee will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                        Delete employee
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}