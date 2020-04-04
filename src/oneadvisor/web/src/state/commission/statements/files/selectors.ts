import { createSelector } from "reselect";

import { RootState } from "@/state";

import { FilesState } from "../";

const rootSelector = (state: RootState): FilesState => state.commission.statements.files;

export const statementFilesSelector: (state: RootState) => FilesState = createSelector(
    rootSelector,
    (root) => root
);
