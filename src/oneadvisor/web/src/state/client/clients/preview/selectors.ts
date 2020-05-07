import { createSelector } from "reselect";

import { RootState } from "@/state";

import { PreviewState } from "../types";

const rootSelector = (state: RootState): PreviewState => state.client.clients.preview;

export const clientPreviewSelector: (state: RootState) => PreviewState = createSelector(
    rootSelector,
    (root) => root
);

export const clientPreviewIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.fetching || !root.client
);
