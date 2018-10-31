import { combineReducers } from 'redux';

import { reducer as users } from './users/reducer';

export const reducer = combineReducers({
  users,
});