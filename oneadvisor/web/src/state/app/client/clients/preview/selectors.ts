import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.client.clients.preview;

export const clientPreviewSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const clientPreviewIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    root => root.fetching || !root.client
);
