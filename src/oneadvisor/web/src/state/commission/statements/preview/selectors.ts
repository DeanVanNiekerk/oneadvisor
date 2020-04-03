import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PreviewState } from "../";

const rootSelector = (state: RootState): PreviewState => state.commission.statements.preview;

export const statementPreviewSelector: (state: RootState) => PreviewState = createSelector(
    rootSelector,
    (root) => root
);

export const statementPreviewIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.fetching || !root.statement
);
