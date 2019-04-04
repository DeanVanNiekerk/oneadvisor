import { combineReducers } from 'redux';

import { reducer as listReducer, State as ListState } from './list/reducer';
import { reducer as policyProductTypeReducer, State as PolicyProductTypeState } from './policyProductType/reducer';

export type State = {
    list: ListState;
    policyProductType: PolicyProductTypeState;
};

export const reducer = combineReducers({
    list: listReducer,
    policyProductType: policyProductTypeReducer,
});
