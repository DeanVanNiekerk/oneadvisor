import { combineReducers } from "redux";

import { reducer as listReducer } from "./list/reducer";
import { reducer as policyTypeCharacteristicReducer } from "./policyTypeCharacteristic/reducer";
import { PolicyTypeCharacteristicsState } from "./types";

export const reducer = combineReducers<PolicyTypeCharacteristicsState>({
    list: listReducer,
    policyTypeCharacteristic: policyTypeCharacteristicReducer,
});
