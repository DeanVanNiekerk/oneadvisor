import { combineReducers } from 'redux';

import { reducer as users } from './users/reducer';

export default combineReducers({
  users,
});