import { ApiAction } from "@/app/types";
import { clientsApi } from "@/config/api/client";

import { ClientPreview } from "../types";

type ClientPreviewReceiveAction = {
    type: "CLIENTS_CLIENT_PREVIEW_RECEIVE";
    payload: ClientPreview | null;
};
type ClientPreviewFetchingAction = { type: "CLIENTS_CLIENT_PREVIEW_FETCHING" };
type ClientPreviewFetchingErrorAction = {
    type: "CLIENTS_CLIENT_PREVIEW_FETCHING_ERROR";
};

export type ClientPreviewAction =
    | ClientPreviewReceiveAction
    | ClientPreviewFetchingAction
    | ClientPreviewFetchingErrorAction;

export const receiveClientPreview = (client: ClientPreview | null): ClientPreviewReceiveAction => ({
    type: "CLIENTS_CLIENT_PREVIEW_RECEIVE",
    payload: client,
});

export const fetchClientPreview = (clientId: string): ApiAction => ({
    type: "API",
    endpoint: `${clientsApi}/${clientId}/preview`,
    dispatchPrefix: "CLIENTS_CLIENT_PREVIEW",
});

export const clearClientPreview = (): ClientPreviewReceiveAction => receiveClientPreview(null);
