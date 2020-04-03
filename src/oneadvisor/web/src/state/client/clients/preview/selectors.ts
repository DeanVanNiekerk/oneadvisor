import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { PreviewState } from "../";

const rootSelector = (state: RootState): PreviewState => state.client.clients.preview;

export const clientPreviewSelector: (state: RootState) => PreviewState = createSelector(
    rootSelector,
    (root) => root
);

export const clientPreviewIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.fetching || !root.client
);
