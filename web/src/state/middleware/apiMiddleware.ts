import { showNotification } from '@/ui/feedback/notifcation/notification';

const handleError = (store: any, dispatchPrefix: string, error: string) => {
    showNotification(
        'error',
        'Server Error',
        'A server error occured please reload the page'
    );
    console.log(error);

    //Fetching Error
    store.dispatch({
        type: `${dispatchPrefix}_FETCHING_ERROR`,
        payload: error
    });
};

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
                    //Validation
                    store.dispatch({
                        type: `${dispatchPrefix}_VALIDATION_ERROR`,
                        payload: json
                    });
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
