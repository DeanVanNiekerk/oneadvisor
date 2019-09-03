import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";
import { BarDatum } from "@nivo/bar";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.commission.reports.commissionLapse;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);
