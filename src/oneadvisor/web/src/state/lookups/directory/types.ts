import {
    AdviceScopesState,
    AdviceServicesState,
    AllLookupsState,
    BranchesSimpleState,
    CompaniesState,
    LicenseCategoriesState,
    UsersSimpleState,
    UserTypesState,
} from "./";

export type LookupsState = {
    readonly all: AllLookupsState;
    readonly companies: CompaniesState;
    readonly userTypes: UserTypesState;
    readonly adviceScopes: AdviceScopesState;
    readonly adviceServices: AdviceServicesState;
    readonly licenseCategories: LicenseCategoriesState;
    readonly branchesSimple: BranchesSimpleState;
    readonly usersSimple: UsersSimpleState;
};
