import { combineReducers } from 'redux';

import users from './users/reducer';
import auth from './auth/reducer';

const reducers = {
    auth,
    users,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;