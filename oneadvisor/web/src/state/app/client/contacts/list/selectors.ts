import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.client.contacts.list;

export const contactsSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);
