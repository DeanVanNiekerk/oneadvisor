import { createSelector } from "reselect";

import { RootState } from "@/state";
import { contextSelector } from "@/state/context/selectors";

import { ListState } from "../";
import { LicenseCategory } from "../types";

const rootSelector = (state: RootState): ListState =>
    state.directory.lookups.licenseCategories.list;

export const licenseCategoriesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
