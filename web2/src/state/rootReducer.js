import { combineReducers } from 'redux';

import app from './app/reducer';
import context from './context/reducer';
import auth from './auth/reducer';

const reducers = {
    auth,
    app,
    context
};

const rootReducer = combineReducers(reducers);

export default rootReducer;