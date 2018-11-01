
import { createStore, compose, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { apiMiddleware } from 'redux-api-middleware';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import httpAuthInjector from './middleware/httpAuthInjector'

export const history = createBrowserHistory({ basename: '/' });

const middleware = [
  thunk,
  httpAuthInjector,
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

