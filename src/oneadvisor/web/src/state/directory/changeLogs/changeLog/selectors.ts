import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ChangeLogState } from "../";

const rootSelector = (state: RootState): ChangeLogState => state.directory.changeLogs.changeLog;

export const changeLogSelector: (state: RootState) => ChangeLogState = createSelector(
    rootSelector,
    (root) => root
);
