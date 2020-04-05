import {
    AdviceScopesState,
    AdviceServicesState,
    AllLookupsState,
    CompaniesState,
    LicenseCategoriesState,
    UserTypesState,
} from "./";

export type LookupsState = {
    all: AllLookupsState;
    companies: CompaniesState;
    userTypes: UserTypesState;
    adviceScopes: AdviceScopesState;
    adviceServices: AdviceServicesState;
    licenseCategories: LicenseCategoriesState;
};
