import { ValidationResult } from "@/app/validation/types";

export type Contact = {
    id: string;
    clientId: string;
    contactTypeId: string;
    value: string;
};

export type ContactEdit = {
    id: string | null;
    clientId: string;
    contactTypeId: string;
    value: string;
};

export type ContactState = {
    readonly contact: ContactEdit | null;
    readonly contactOriginal: ContactEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type ListState = {
    readonly totalItems: number;
    readonly items: Contact[];
    readonly fetching: boolean;
};

export type ContactsState = {
    readonly list: ListState;
    readonly contact: ContactState;
};
