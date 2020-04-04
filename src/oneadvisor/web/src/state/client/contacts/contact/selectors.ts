import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { ContactState } from "../";

const rootSelector = (state: RootState): ContactState => state.client.contacts.contact;

export const contactSelector: (state: RootState) => ContactState = createSelector(
    rootSelector,
    (root) => root
);

export const contactIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.contact, root.contactOriginal)
);

export const contactIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);
