import { combineReducers } from 'redux';

import directory from './directory/reducer';
import auth from './auth/reducer';

const reducers = {
    auth,
    directory,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;