import { createStore, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { apiMiddleware } from 'redux-api-middleware';
import createOidcMiddleware from 'redux-oidc';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

import userManager from 'auth/userManager';

export const history = createBrowserHistory({ basename: '/' });

const oidcMiddleware = createOidcMiddleware(userManager);

const middleware = [
  thunk,
  apiMiddleware,
  oidcMiddleware,
  routerMiddleware(history)
];

// enables Redux devtools extension if present
const enhancers = [];
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

export const store = createStore(
  connectRouter(history)(rootReducer),
  undefined, // preloaded state
  compose(applyMiddleware(...middleware), ...enhancers),
);
