import { combineReducers } from "redux";

import { reducer as all } from "./all/reducer";
import { reducer as clientTypes } from "./clientTypes/reducer";
import { reducer as contactTypes } from "./contactTypes/reducer";
import { reducer as marritalStatus } from "./marritalStatus/reducer";
import { reducer as policyProducts } from "./policyProducts/reducer";
import { reducer as policyProductTypes } from "./policyProductTypes/reducer";
import { reducer as policyTypeCharacteristics } from "./policyTypeCharacteristics/reducer";
import { reducer as policyTypes } from "./policyTypes/reducer";
import { LookupsState } from "./types";

export const reducer = combineReducers<LookupsState>({
    all: all,
    marritalStatus: marritalStatus,
    contactTypes: contactTypes,
    policyTypes: policyTypes,
    clientTypes: clientTypes,
    policyProductTypes: policyProductTypes,
    policyProducts: policyProducts,
    policyTypeCharacteristics: policyTypeCharacteristics,
});
