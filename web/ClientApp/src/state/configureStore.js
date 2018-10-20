import { createStore, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { apiMiddleware } from 'redux-api-middleware';
import { loadUser } from "redux-oidc";
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

import userManager from 'auth/userManager';

export const history = createBrowserHistory({ basename: '/' });

const middleware = [
  thunk,
  apiMiddleware,
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

//Loads potentially existing user data into the redux store, 
//thus eliminating a new authentication roundtrip to the authentication server when a tab is closed or a new tab is opened.
loadUser(store, userManager);
