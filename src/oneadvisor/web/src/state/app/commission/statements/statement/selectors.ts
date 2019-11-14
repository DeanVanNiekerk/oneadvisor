import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.statements.statement;

export const statementSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const statementIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => !areEqual(root.statement, root.statementOriginal)
);

export const statementIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => root.updating || root.fetching
);
