import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.client.contacts.contact;

export const contactSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);
