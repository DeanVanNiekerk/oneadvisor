import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.audit.logs.list;

export const auditLogsSelector: (state: RootState) => State = createSelector(
    rootSelector,
    (root) => root
);
