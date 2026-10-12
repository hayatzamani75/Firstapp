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
import { Customer } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    customer: Customer;
}

export function DeleteCustomerDialog({ customer }: IProps) {
    const form = useForm();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.delete(route('customer.destroy', customer.id), {
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
                <Button size="sm" className="text-[11px] bg-red-600 hover:bg-red-700 text-white">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this customer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
