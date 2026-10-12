import { Teacher } from '@/types';
import { DeleteTeacherDialog } from './DeleteTeacherDialog';
import { EditTeacherDialog } from './EditTeacherDialog';

interface IProps {
    teachers: Teacher[];
}

const TeacherCard = ({ teachers }: IProps) => {
    return (
        <>
            {teachers.length > 0 ? (
                <div className="space-y-3">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                                        Teacher
                                    </div>
                                    <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                                        {teacher.name} {teacher.lastname}
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {teacher.position}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {teacher.email}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                                        {teacher.address || 'No address added yet.'}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <EditTeacherDialog teacher={teacher} />
                                    <DeleteTeacherDialog teacher={teacher} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span className="block py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No teachers found.
                </span>
            )}
        </>
    );
};

export default TeacherCard;
