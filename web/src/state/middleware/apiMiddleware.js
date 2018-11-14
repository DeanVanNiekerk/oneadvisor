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
        .then(resp => resp.json())
        .then(json => {
            if (action.onSuccess) action.onSuccess(json);
            return json;
        })
        .then(json => {
            //Recieve
            store.dispatch({
                type: `${dispatchPrefix}_RECEIVE`,
                payload: json
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
