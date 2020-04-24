import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { AdviceServiceState } from "../";

const rootSelector = (state: RootState): AdviceServiceState =>
    state.lookups.directory.adviceServices.adviceService;

export const adviceServiceSelector: (state: RootState) => AdviceServiceState = createSelector(
    rootSelector,
    (root) => root
);

export const adviceServiceIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.adviceService, root.adviceServiceOriginal)
);
