import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import ReduxAsyncQueue from 'redux-async-queue';
import thunk from 'redux-thunk';

import apiMiddleware from './middleware/apiMiddleware';
import createRootReducer from './rootReducer';

export const history = createBrowserHistory({ basename: '/' });

const middleware = [
    thunk,
    ReduxAsyncQueue,
    apiMiddleware,
    routerMiddleware(history)
];

// enables Redux devtools extension if present
const enhancers = [] as any[];
if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__());
}

export const configureStore = () => {
    const store = createStore(
        createRootReducer(history),
        undefined, // preloaded state
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    );

    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./rootReducer', () => {
            const nextCreateRootReducer = require('./rootReducer').default;
            store.replaceReducer(nextCreateRootReducer(history));
        });
    }

    return store;
};
