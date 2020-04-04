import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.changeLogs.list;

export const changeLogsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
