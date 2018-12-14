import { isArray } from 'util';

import { showMessage, showNotification } from '@/ui/feedback/notifcation';

export default (store: any) => (next: any) => (action: any) => {
    // Check if this is an api request
    if (action.type !== 'API') {
        return next(action);
    }

    const { endpoint, method, dispatchPrefix, options, payload } = action;

    const defaultOptions = {
        method: method ? method : 'GET',
        headers: {
            Authorization: 'Bearer ' + store.getState().auth.idToken,
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    const fetchOptions = {
        ...defaultOptions,
        ...options
    };

    if (payload) fetchOptions.body = JSON.stringify(payload);

    //Fetching
    store.dispatch({
        type: `${dispatchPrefix}_FETCHING`
    });

    //console.log(endpoint, fetchOptions);

    fetch(endpoint, fetchOptions)
        .then(resp => {
            //Check for server error
            if (resp.status === 500) {
                return resp.text().then(text => {
                    handleError(store, dispatchPrefix, text);
                });
            }

            //Unauthorized, reload page
            // if (resp.status === 401) {
            //     window.location.reload();
            //     return;
            // }

            return resp.json().then(json => {
                //Check for validation error
                if (resp.status === 400) {
                    handleValidationError(store, dispatchPrefix, json);
                    return;
                }

                //Call onSuccess
                if (action.onSuccess) action.onSuccess(json);

                //Recieve
                store.dispatch({
                    type: `${dispatchPrefix}_RECEIVE`,
                    payload: json
                });

                return json;
            });
        })
        .catch(error => {
            handleError(store, dispatchPrefix, error);
        });
};

const handleError = (store: any, dispatchPrefix: string, error: string) => {
    showNotification(
        'error',
        'Server Error: Unhandled',
        'A server error occured please reload the page',
        10
    );
    console.log(error);

    //Fetching Error
    store.dispatch({
        type: `${dispatchPrefix}_FETCHING_ERROR`,
        payload: error
    });
};

const handleValidationError = (
    store: any,
    dispatchPrefix: string,
    json: any
) => {
    //Check if this is one of our validation messages
    if (!isArray(json)) {
        let error = JSON.stringify(json);
        showNotification('error', 'Server Error: Validation', error, 10);
        console.log(error);
        store.dispatch({
            type: `${dispatchPrefix}_RECEIVE`,
            payload: null
        });
        return;
    }

    showMessage(
        'warning',
        'Data not saved, check form for validation errors',
        6.5
    );

    //Validation Error
    store.dispatch({
        type: `${dispatchPrefix}_VALIDATION_ERROR`,
        payload: json
    });
};
