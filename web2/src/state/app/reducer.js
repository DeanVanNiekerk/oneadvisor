import { combineReducers } from 'redux';
import { reducer as directory } from './directory/reducer';

export default combineReducers({
  directory,
});
