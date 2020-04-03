import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { StatementState } from "../";

const rootSelector = (state: RootState): StatementState => state.commission.statements.statement;

export const statementSelector: (state: RootState) => StatementState = createSelector(
    rootSelector,
    (root) => root
);

export const statementIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.statement, root.statementOriginal)
);

export const statementIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);
