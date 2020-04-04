import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.client.contacts.list;

export const contactsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
