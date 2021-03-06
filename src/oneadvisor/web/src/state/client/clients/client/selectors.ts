import { createSelector } from "reselect";

import { areEqual } from "@/app/utils";
import { RootState } from "@/state";

import { ClientState } from "../types";

const rootSelector = (state: RootState): ClientState => state.client.clients.client;

export const clientSelector: (state: RootState) => ClientState = createSelector(
    rootSelector,
    (root) => root
);

export const clientIsModifiedSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => !areEqual(root.client, root.clientOriginal)
);

export const clientIsLoadingSelector: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => root.updating || root.fetching
);

export const clientIsMarried: (state: RootState) => boolean = createSelector(
    rootSelector,
    (root) => {
        const client = root.client;

        if (!client) return false;

        const marriedStatus = [
            "5f7a5d69-845c-4f8d-b108-7c70084f3f6a", //Married COP
            "b31331ec-73cb-4985-aa93-e60e04a48095", //Married ANC
            "b16cbd3b-cf50-4a74-8f38-a8ca6b1cb83f", //Married ANC (with Accrual)
        ];

        return marriedStatus.some((id) => client.marritalStatusId === id);
    }
);
