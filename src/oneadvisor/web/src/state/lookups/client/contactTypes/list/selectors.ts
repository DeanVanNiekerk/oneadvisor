import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ContactTypesListState } from "../types";

const rootSelector = (state: RootState): ContactTypesListState =>
    state.lookups.client.contactTypes.list;

export const contactTypesSelector: (state: RootState) => ContactTypesListState = createSelector(
    rootSelector,
    (root) => root
);
