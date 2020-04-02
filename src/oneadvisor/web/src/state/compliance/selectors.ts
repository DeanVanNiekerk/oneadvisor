import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./types";

const rootSelector = (state: RootState): State => state.compliance;

export const complianceSelector: (state: RootState) => State = createSelector(
    rootSelector,
    (root) => {
        return root;
    }
);
