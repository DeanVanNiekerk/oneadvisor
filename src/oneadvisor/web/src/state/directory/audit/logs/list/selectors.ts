import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.directory.audit.logs.list;

export const auditLogsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
