import { combineReducers } from 'redux';

import { CommissionTypeAction } from './commissionType/actions';
import { reducer as commissionTypeReducer, State as CommissionTypeState } from './commissionType/reducer';
import { CommissionTypeListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = CommissionTypeListAction | CommissionTypeAction;

export type State = {
    list: ListState;
    commissionType: CommissionTypeState;
};

export const reducer = combineReducers({
    list: listReducer,
    commissionType: commissionTypeReducer
});
