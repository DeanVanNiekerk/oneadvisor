import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import createRootReducer from './rootReducer';
import apiMiddleware from './middleware/apiMiddleware';

export const history = createBrowserHistory({ basename: '/' });

const middleware = [thunk, apiMiddleware, routerMiddleware(history)];

// enables Redux devtools extension if present
const enhancers = [];
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
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
