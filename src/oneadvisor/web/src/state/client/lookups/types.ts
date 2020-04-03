import {
    AllLookupsState,
    ClientTypesState,
    ContactTypesState,
    MarritalStatusState,
    PolicyProductsState,
    PolicyProductTypesState,
    PolicyTypesState,
} from "./";

export type LookupsState = {
    all: AllLookupsState;
    contactTypes: ContactTypesState;
    marritalStatus: MarritalStatusState;
    policyTypes: PolicyTypesState;
    clientTypes: ClientTypesState;
    policyProductTypes: PolicyProductTypesState;
    policyProducts: PolicyProductsState;
};
