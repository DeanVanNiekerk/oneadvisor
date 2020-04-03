import { ValidationResult } from "@/app/validation";

export type Organisation = {
    id: string;
    name: string;
    vatRegistered: boolean;
    vatRegistrationDate: string | null;
    config: Config;
};

export type OrganisationEdit = {
    id: string | null;
    name: string;
    vatRegistered: boolean;
    vatRegistrationDate: string | null;
    config: Config;
};

export type Config = {
    companyIds: string[];
    applicationIds: string[];
};

export type ListState = {
    readonly totalItems: number;
    readonly items: Organisation[];
    readonly fetching: boolean;
};

export type OrganisationState = {
    readonly organisation: OrganisationEdit | null;
    readonly organisationOriginal: OrganisationEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type OrganisationsState = {
    readonly list: ListState;
    readonly organisation: OrganisationState;
};
