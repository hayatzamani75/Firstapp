import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Note } from '@/types';
import { DeleteAlertDialog } from './DeleteAlertDialog';
import { EditDialog } from './EditDialog';

interface IProps {
    notes: Note[];
}

const NoteCard = ({ notes }: IProps) => {
    return (
        <>
            {notes.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:place-items-center lg:grid-cols-3 xl:grid-cols-4">
                    {notes.map((i, idx) => {
                        return (
                            <div key={idx} className="">
                                <Card className="w-full">
                                    <CardHeader>
                                        <CardTitle>
                                            <div className="flex items-center justify-between gap-x-2">
                                                <span className="">
                                                    {i.title}
                                                </span>
                                                <div className="flex gap-x-2">
                                                    <EditDialog note={i} />
                                                    <DeleteAlertDialog
                                                        note={i}
                                                    />
                                                </div>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="">
                                            {i.description}
                                        </span>
                                    </CardContent>
                                    <CardFooter className=""></CardFooter>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <span className="text-center text-destructive text-gray-50">
                    No notes found.
                </span>
            )}
        </>
    );
};

export default NoteCard;
