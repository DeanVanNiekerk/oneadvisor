import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation";
import { ClientTypeId } from "@/state/lookups/client/clientTypes/enums";

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

export type ClientState = {
    readonly client: ClientEdit | null;
    readonly clientOriginal: ClientEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type ListState = {
    readonly items: Client[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
    readonly selectedClientIds: string[];
};

export type MergeState = {
    readonly clients: Client[];
    readonly fetching: boolean;
    readonly currentStepIndex: number;
    readonly steps: string[];
    readonly insertedClient: ClientEdit | null;
};

export type PreviewState = {
    readonly client: ClientPreview | null;
    readonly fetching: boolean;
};

export type SearchState = {
    readonly items: Client[];
    readonly fetching: boolean;
};

export type ClientsState = {
    readonly list: ListState;
    readonly search: SearchState;
    readonly client: ClientState;
    readonly preview: PreviewState;
    readonly merge: MergeState;
};
