import { combineReducers } from 'redux';

import { CommissionAction } from './commission/actions';
import { reducer as commissionReducer, State as CommissionState } from './commission/reducer';
import { CommissionListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = CommissionListAction | CommissionAction;

export type State = {
    list: ListState;
    commission: CommissionState;
};

export const reducer = combineReducers({
    list: listReducer,
    commission: commissionReducer
});
