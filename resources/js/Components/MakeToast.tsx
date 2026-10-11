import toast from 'react-hot-toast';

export const MakeToastSuccess = (text: string) => {
    toast.success(text, {
        style: {
            borderRadius: '4px',
            background: '#fff',
            color: '#333',
        },
        // position: "top-right",
    });
};

export const MakeToastError = (text: string) => {
    toast.error(text, {
        style: {
            borderRadius: '4px',
            background: '#fff',
            color: '#333',
        },
        // position: "top-right",
    });
};
