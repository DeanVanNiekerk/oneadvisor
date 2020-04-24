import { AdviceScope, AdviceService, Company, LicenseCategory, UserType } from "../";

export type Lookups = {
    companies: Company[];
    userTypes: UserType[];
    adviceScopes: AdviceScope[];
    adviceServices: AdviceService[];
    licenseCategories: LicenseCategory[];
};

export type AllLookupsState = {
    readonly fetching: boolean;
};
