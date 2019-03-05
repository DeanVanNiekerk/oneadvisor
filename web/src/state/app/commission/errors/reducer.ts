import { combineReducers } from 'redux';

import { reducer as formatReducer, State as FormatState } from './format/reducer';
import { reducer as listReducer, State as ErrorsState } from './list/reducer';
import { reducer as mappingReducer, State as MappingState } from './mapping/reducer';

export type State = {
    format: FormatState;
    mapping: MappingState;
    list: ErrorsState;
};

export const reducer = combineReducers({
    format: formatReducer,
    mapping: mappingReducer,
    list: listReducer,
});
