export type Client = {
    id: string;
    clientTypeId: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    passportNumber: string;
    dateOfBirth: string;
    taxNumber: string;
    marritalStatusId: string;
    marriageDate: string;
};

export type ClientEdit = {
    id: string;
    clientTypeId: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    passportNumber: string;
    dateOfBirth: string;
    taxNumber: string;
    marritalStatusId: string;
    marriageDate: string;
};

export type ClientPreview = {
    id: string;
    clientTypeId: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string | null;

    policyCount: number;
    contactCount: number;
};

export type MergeClients = {
    targetClient: ClientEdit;
    sourceClientIds: string[];
};
