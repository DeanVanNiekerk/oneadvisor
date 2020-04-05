import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { LicenseCategoryState } from "../";

const rootSelector = (state: RootState): LicenseCategoryState =>
    state.directory.lookups.licenseCategories.licenseCategory;

export const licenseCategorySelector: (state: RootState) => LicenseCategoryState = createSelector(
    rootSelector,
    (root) => root
);

export const licenseCategoryIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.licenseCategory, root.licenseCategoryOriginal)
);
