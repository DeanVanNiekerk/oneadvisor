import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';

import users from './users/reducer';

const reducers = {
    users,
    oidc: oidcReducer,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;