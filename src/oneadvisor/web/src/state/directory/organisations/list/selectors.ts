import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.directory.organisations.list;

export const organisationsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
