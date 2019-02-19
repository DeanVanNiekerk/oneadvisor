import { combineReducers } from 'redux';

import { CommissionFormatErrorAction } from './format/actions';
import { reducer as formatReducer, State as FormatState } from './format/reducer';
import { CommissionMappingErrorAction } from './mapping/actions';
import { reducer as mappingReducer, State as MappingState } from './mapping/reducer';

export type Action = CommissionFormatErrorAction | CommissionMappingErrorAction;

export type State = {
    format: FormatState;
    mapping: MappingState;
};

export const reducer = combineReducers({
    format: formatReducer,
    mapping: mappingReducer
});
