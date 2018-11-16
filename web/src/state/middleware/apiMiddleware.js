export default store => next => action => {
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
            //Fetching Error
            store.dispatch({
                type: `${dispatchPrefix}_FETCHING_ERROR`,
                payload: error
            });
        });
};
