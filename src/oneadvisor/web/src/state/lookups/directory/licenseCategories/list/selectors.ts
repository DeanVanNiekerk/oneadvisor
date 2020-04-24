import { createSelector } from "reselect";

import { RootState } from "@/state";

import { LicenseCategoryListState } from "../";

const rootSelector = (state: RootState): LicenseCategoryListState =>
    state.lookups.directory.licenseCategories.list;

export const licenseCategoriesSelector: (
    state: RootState
) => LicenseCategoryListState = createSelector(rootSelector, (root) => root);
