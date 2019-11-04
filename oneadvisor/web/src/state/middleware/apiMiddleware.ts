import { Dispatch, Store } from "redux";
import { isArray } from "util";

import { ApiAction, ApiOnValidationFailure } from "@/app/types";
import { showMessage, showNotification } from "@/ui/feedback/notifcation";

import { RootState } from "../rootReducer";

export default (store: Store<RootState>) => (next: any) => (action: ApiAction) => {
    // Check if this is an api request
    if (action.type !== "API") {
        return next(action);
    }

    const { endpoint, method, dispatchPrefix, payload } = action;

    const rootState = store.getState();

    let headers: HeadersInit = {
        "Content-Type": "application/json; charset=utf-8",
    };

    if (rootState.auth.token.token) {
        headers.Authorization = "Bearer " + rootState.auth.token.token;
    }

    const requestInit: RequestInit = {
        method: method ? method : "GET",
        headers: headers,
    };

    if (payload) requestInit.body = JSON.stringify(payload);

    //Fetching
    if (dispatchPrefix) {
        store.dispatch({
            type: `${dispatchPrefix}_FETCHING`,
        });
    }

    //console.log(endpoint, fetchOptions);

    const showNotifications = action.hideNotifications === undefined || action.hideNotifications !== true;

    const showValidationNotifications =
        action.hideValidationNotifications === undefined || action.hideValidationNotifications !== true;

    fetch(endpoint, requestInit)
        .then(resp => {
            //Check for server error
            if (resp.status === 500) {
                return resp.text().then(text => {
                    //Call onFailure
                    if (action.onFailure) action.onFailure(text);

                    handleError(showNotifications, store, dispatchPrefix, text);
                });
            }

            //Call onSuccessBlob
            if (action.onSuccessBlob) {
                if (resp.status === 200) {
                    resp.blob().then(blob => {
                        if (action.onSuccessBlob) action.onSuccessBlob(blob, store.dispatch);
                    });
                    return;
                }
            }

            //Unauthorized, reload page
            if (resp.status === 401) {
                showNotification("error", "Unauthorized", `Unauthorized Api call to '${endpoint}'`, 20);
                return;
            }

            if (resp.status === 404) {
                //Recieve
                if (dispatchPrefix) {
                    store.dispatch({
                        type: `${dispatchPrefix}_RECEIVE`,
                        payload: null,
                    });
                }
                return;
            }

            return resp.json().then(json => {
                //Check for validation error
                if (resp.status === 400) {
                    //Call onFailure
                    if (action.onFailure) action.onFailure(json);

                    handleValidationError(
                        showNotifications && showValidationNotifications,
                        store,
                        dispatchPrefix,
                        json,
                        action.onValidationFailure,
                        store.dispatch
                    );
                    return;
                }

                //Call onSuccess
                if (action.onSuccess) action.onSuccess(json, store.dispatch);

                //Recieve
                if (dispatchPrefix) {
                    store.dispatch({
                        type: `${dispatchPrefix}_RECEIVE`,
                        payload: json,
                    });
                }

                return json;
            });
        })
        .catch(error => {
            //Call onFailure
            if (action.onFailure) action.onFailure(error);

            handleError(showNotifications, store, dispatchPrefix, error);
        });
};

const handleError = (showNotifications: boolean, store: any, dispatchPrefix: string | undefined, error: string) => {
    if (showNotifications) {
        showNotification("error", "Server Error: Unhandled", "A server error occured please reload the page", 10);
    }
    console.log(error);

    //Fetching Error
    if (dispatchPrefix) {
        store.dispatch({
            type: `${dispatchPrefix}_FETCHING_ERROR`,
            payload: error,
        });
    }
};

const handleValidationError = (
    showNotifications: boolean,
    store: any,
    dispatchPrefix: string | undefined,
    json: any,
    validationFailureCallback: ApiOnValidationFailure | undefined,
    dispatch: Dispatch
) => {
    //Check if this is one of dotnets parse erros
    if (!isArray(json)) {
        let error = JSON.stringify(json);
        if (showNotifications) {
            showNotification("error", "Server Error: Validation", error, 10);
        }
        console.log(error);

        if (dispatchPrefix) {
            store.dispatch({
                type: `${dispatchPrefix}_RECEIVE`,
                payload: null,
            });
        }
        return;
    }

    if (showNotifications) {
        showMessage("error", "Data not saved, check form for validation errors", 6.5);
    }

    //Validation Error
    if (validationFailureCallback) validationFailureCallback(json, dispatch);

    if (dispatchPrefix) {
        store.dispatch({
            type: `${dispatchPrefix}_VALIDATION_ERROR`,
            payload: json,
        });
    }
};
