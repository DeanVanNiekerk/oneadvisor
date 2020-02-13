import { ClientTypeId } from "../lookups";

export type Client = {
    id: string;
    clientTypeId: ClientTypeId;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    alternateIdNumber: string;
    dateOfBirth: string | null;
    taxNumber: string;
    marritalStatusId: string | null;
    marriageDate: string | null;
};

export type ClientEdit = {
    id: string | null;
    clientTypeId: ClientTypeId;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    alternateIdNumber: string;
    dateOfBirth: string | null;
    taxNumber: string;
    marritalStatusId: string | null;
    marriageDate: string | null;
};

export type ClientPreview = {
    id: string;
    clientTypeId: ClientTypeId;
    firstName: string;
    lastName: string;
    idNumber: string;
    alternateIdNumber: string;
    dateOfBirth: string | null;

    policyCount: number;
    contactCount: number;
};

export type MergeClients = {
    targetClient: ClientEdit;
    sourceClientIds: string[];
};
