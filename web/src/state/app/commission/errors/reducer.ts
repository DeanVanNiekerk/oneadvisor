import { combineReducers } from 'redux';

import { CommissionErrorAction } from './format/actions';
import { reducer as formatReducer, State as FormatState } from './format/reducer';

export type Action = CommissionErrorAction;

export type State = {
    format: FormatState;
};

export const reducer = combineReducers({
    format: formatReducer
});
