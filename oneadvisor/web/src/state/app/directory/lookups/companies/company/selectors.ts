import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.lookups.companies.company;

export const companySelector: (state: RootState) => State = createSelector(rootSelector, root => root);

export const companyIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.company, root.companyOriginal)
);
