import { combineReducers } from 'redux';

import { reducer as list } from './list/reducer';

export const reducer = combineReducers({
  list,
});