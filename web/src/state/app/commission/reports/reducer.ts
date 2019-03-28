import { combineReducers } from 'redux';

import { reducer as clientRevenue, State as ClientRevenueState } from './clientRevenue/reducer';

export type State = {
    clientRevenue: ClientRevenueState;
};

export const reducer = combineReducers({
    clientRevenue: clientRevenue,
});
