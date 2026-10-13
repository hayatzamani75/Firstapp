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
import { Employee } from '@/types';
import { useForm } from '@inertiajs/react';

interface IProps {
    employee: Employee;
}

export function EditEmployeeDialog({ employee }: IProps) {
    const form = useForm({
        name: employee.name,
        lastname: employee.lastname,
        phone: employee.phone,
        email: employee.email,
        address: employee.address || '',
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            address: data.address || null,
        }));
        form.put(route('employee.update', employee.id), {
            preserveState: false,
            onSuccess: (response) => {
                const flash = response.props.flash;
                if (flash.success) return MakeToastSuccess(flash.success);
                if (flash.error) return MakeToastError(flash.error);
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-blue-200 text-[11px] text-blue-700 hover:bg-blue-50">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border-blue-100 bg-[#EFF6FF] p-0 sm:max-w-lg [&>button]:text-blue-100 [&>button]:hover:text-white">
                <DialogHeader className="rounded-t-xl bg-blue-700 px-6 py-5 pr-14 text-left text-white">
                    <DialogTitle className="text-white">Edit employee</DialogTitle>
                    <DialogDescription className="text-blue-100">
                        Update this employee&apos;s details.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div>
                        <label htmlFor={`edit-employee-name-${employee.id}`} className="mb-2 block text-sm font-medium text-slate-800">
                            First name
                        </label>
                        <Input id={`edit-employee-name-${employee.id}`} value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} maxLength={255} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                        <span className="text-sm text-red-600">{form.errors.name}</span>
                    </div>

                    <div>
                        <label htmlFor={`edit-employee-lastname-${employee.id}`} className="mb-2 block text-sm font-medium text-slate-800">
                            Last name
                        </label>
                        <Input id={`edit-employee-lastname-${employee.id}`} value={form.data.lastname} onChange={(event) => form.setData('lastname', event.target.value)} maxLength={255} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                        <span className="text-sm text-red-600">{form.errors.lastname}</span>
                    </div>

                    <div>
                        <label htmlFor={`edit-employee-phone-${employee.id}`} className="mb-2 block text-sm font-medium text-slate-800">
                            Phone number
                        </label>
                        <Input id={`edit-employee-phone-${employee.id}`} value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} type="tel" inputMode="numeric" pattern="[0-9]{10,14}" maxLength={14} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                        <span className="text-sm text-red-600">{form.errors.phone}</span>
                    </div>

                    <div>
                        <label htmlFor={`edit-employee-email-${employee.id}`} className="mb-2 block text-sm font-medium text-slate-800">
                            Email address
                        </label>
                        <Input id={`edit-employee-email-${employee.id}`} value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} type="email" maxLength={255} required className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                        <span className="text-sm text-red-600">{form.errors.email}</span>
                    </div>

                    <div>
                        <label htmlFor={`edit-employee-address-${employee.id}`} className="mb-2 block text-sm font-medium text-slate-800">
                            Address
                        </label>
                        <Textarea id={`edit-employee-address-${employee.id}`} value={form.data.address} onChange={(event) => form.setData('address', event.target.value)} maxLength={1000} className="border-blue-200 bg-white focus-visible:ring-blue-500" />
                        <span className="text-sm text-red-600">{form.errors.address}</span>
                    </div>

                    <DialogFooter className="gap-3 border-t border-blue-100 bg-white/70 px-6 py-4 sm:flex-row">
                        <Button disabled={form.processing} type="submit" className="bg-blue-700 text-white hover:bg-blue-800">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}