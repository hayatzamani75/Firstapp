import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
    ziggy: Config & { location: string };
};

export interface Note {
    id: number;
    title: string;
    description: string;
}

export interface Book {
    id: number;
    name: string;
    title: string;
    description: string;
}

export interface Company {
    id: number;
    name: string;
    type: string;
    address: string;
}

export interface Teacher {
    id: number;
    name: string;
    lastname: string;
    position: string;
    email: string;
    address: string;
}

export interface Customer {
    id: number;
    name: string;
    lastname: string;
    email: string;
    address: string;
}
