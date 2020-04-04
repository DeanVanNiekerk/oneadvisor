import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { CompanyState } from "../";

const rootSelector = (state: RootState): CompanyState => state.directory.lookups.companies.company;

export const companySelector: (state: RootState) => CompanyState = createSelector(
    rootSelector,
    (root) => root
);

export const companyIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.company, root.companyOriginal)
);
