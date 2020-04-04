import { createSelector } from "reselect";

import { RootState } from "@/state";

import { HistoryState } from "../";

const rootSelector = (state: RootState): HistoryState => state.directory.audit.logs.history;

export const auditLogHistorySelector: (state: RootState) => HistoryState = createSelector(
    rootSelector,
    (root) => root
);
