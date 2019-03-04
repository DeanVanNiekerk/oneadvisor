import { combineReducers } from 'redux';

import { CommissionFormatErrorAction } from './format/actions';
import { reducer as formatReducer, State as FormatState } from './format/reducer';
import { ErrorListAction } from './list/actions';
import { reducer as listReducer, State as ErrorsState } from './list/reducer';
import { CommissionMappingErrorAction } from './mapping/actions';
import { reducer as mappingReducer, State as MappingState } from './mapping/reducer';

export type Action =
    | CommissionFormatErrorAction
    | CommissionMappingErrorAction
    | ErrorListAction;

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
