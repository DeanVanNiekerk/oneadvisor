import { Filters } from "@/app/table";
import { ValidationResult } from "@/app/validation";

export type Organisation = {
    id: string;
    name: string;
    applicationIds: string[];
    config: Config;
};

export type OrganisationEdit = {
    id: string | null;
    name: string;
    applicationIds: string[];
    config: Config;
};

export type Config = {
    companyIds: string[];
    licenseCategoryIds: string[];
    address: Address;
    branding: Branding;
    complianceOfficer: ComplianceOfficer;
    vatRegistered: boolean;
    vatRegistrationDate: string | null;
    telephoneNumber: string | null;
    hasProfessionalIndemnityCover: boolean;
    hasSharesInProductProviders: boolean;
    hasSharesInProductProvidersTarget: string | null;
    hasReceivedCommissionFromCompanies: boolean;
    hasReceivedCommissionFromCompaniesTarget: string | null;
};

export type Branding = {
    logoStorageName: string | null;
};

export type Address = {
    line1: string;
    line2: string | null;
    suburb: string;
    postalCode: string;
};

export type ComplianceOfficer = {
    name: string | null;
    postalAddress: string | null;
    telephoneNumber: string | null;
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

export type OrganisationsFilters = Filters<{ branchId: string }>;
