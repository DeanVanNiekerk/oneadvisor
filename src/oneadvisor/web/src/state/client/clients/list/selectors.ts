import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ListState } from "../types";

const rootSelector = (state: RootState): ListState => state.client.clients.list;

export const clientsSelector: (state: RootState) => ListState = createSelector(
    rootSelector,
    (root) => root
);
