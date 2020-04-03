import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ContactTypesListState } from "../";

const rootSelector = (state: RootState): ContactTypesListState =>
    state.client.lookups.contactTypes.list;

export const contactTypesSelector: (state: RootState) => ContactTypesListState = createSelector(
    rootSelector,
    (root) => root
);
