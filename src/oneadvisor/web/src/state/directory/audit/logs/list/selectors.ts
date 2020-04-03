import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { ListState } from "../";

const rootSelector = (state: RootState): ListState => state.directory.audit.logs.list;

export const auditLogsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
