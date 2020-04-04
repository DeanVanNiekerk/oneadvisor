import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.applications.list;

export const applicationsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
