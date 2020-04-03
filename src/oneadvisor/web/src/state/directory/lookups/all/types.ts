import { Company, UserType } from "../";

export type Lookups = {
    companies: Company[];
    userTypes: UserType[];
};

export type AllLookupsState = {
    readonly fetching: boolean;
};
