import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State =>
    state.app.commission.lookups.commissionEarningsTypes.list;

export const commissionEarningsTypesSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);
