import { AllLookupsState } from "./all/types";
import { ClientTypesState } from "./clientTypes/types";
import { ContactTypesState } from "./contactTypes/types";
import { MarritalStatusState } from "./marritalStatus/types";
import { PolicyProductsState } from "./policyProducts/types";
import { PolicyProductTypesState } from "./policyProductTypes/types";
import { PolicyTypeCharacteristicsState } from "./policyTypeCharacteristics/types";
import { PolicyTypesState } from "./policyTypes/types";

export type LookupsState = {
    all: AllLookupsState;
    contactTypes: ContactTypesState;
    marritalStatus: MarritalStatusState;
    policyTypes: PolicyTypesState;
    clientTypes: ClientTypesState;
    policyProductTypes: PolicyProductTypesState;
    policyProducts: PolicyProductsState;
    policyTypeCharacteristics: PolicyTypeCharacteristicsState;
};
