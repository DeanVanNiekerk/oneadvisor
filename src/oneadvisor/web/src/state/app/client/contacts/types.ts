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
