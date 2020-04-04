import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Reducer,
    ReducersMapObject,
} from "redux";
import ReduxAsyncQueue from "redux-async-queue";
import thunk from "redux-thunk";

import apiMiddleware from "./middleware/apiMiddleware";
import createStaticReducers from "./rootReducer";

export const history = createBrowserHistory({ basename: "/" });

const middleware = [thunk, ReduxAsyncQueue, apiMiddleware, routerMiddleware(history)];

const staticReducers = createStaticReducers(history);

// enables Redux devtools extension if present
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enhancers = [] as any;
if (window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]) {
    enhancers.push(window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"]());
}

const createReducer = (asyncReducers: ReducersMapObject) => {
    return combineReducers({
        ...staticReducers,
        ...asyncReducers,
    });
};

const store = createStore(
    createReducer({}),
    undefined, // preloaded state,
    compose(applyMiddleware(...middleware), ...enhancers)
);

type AsyncReducers = "directory" | "client" | "commission" | "compliance" | "invest";

const createReducerManager = () => {
    // Add a dictionary to keep track of the registered async reducers
    const asyncReducers: ReducersMapObject = {};

    // Create an inject reducer function
    const injectReducer = (key: AsyncReducers, asyncReducer: Reducer) => {
        if (asyncReducers[key]) {
            console.log("reducer already added");
            return;
        }

        asyncReducers[key] = asyncReducer;

        store.replaceReducer(createReducer(asyncReducers));
    };

    const hasReducer = (key: AsyncReducers): boolean => {
        return !!asyncReducers[key];
    };

    const dispatch = (action: AnyAction): void => {
        store.dispatch(action);
    };

    return {
        injectReducer,
        hasReducer,
        dispatch,
    };
};

export const reducerManager = createReducerManager();

export const getStore = () => {
    return store;
};
