import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.client.lookups.policyProductTypes.policyProductType;

export const policyProductTypeSelector: (state: RootState) => State = createSelector(rootSelector, root => root);
