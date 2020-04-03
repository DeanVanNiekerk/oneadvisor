import {
    AllLookupsState,
    CommissionEarningsTypesState,
    CommissionStatementTemplateFieldNamesState,
    CommissionStatementTemplateGroupFieldNamesState,
    CommissionTypesState,
} from "./";

export type LookupsState = {
    all: AllLookupsState;
    commissionTypes: CommissionTypesState;
    commissionStatementTemplateFieldNames: CommissionStatementTemplateFieldNamesState;
    commissionStatementTemplateGroupFieldNames: CommissionStatementTemplateGroupFieldNamesState;
    commissionEarningsTypes: CommissionEarningsTypesState;
};
