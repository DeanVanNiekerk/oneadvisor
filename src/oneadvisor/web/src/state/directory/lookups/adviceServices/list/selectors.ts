import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.lookups.adviceServices.list;

export const adviceServicesSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
