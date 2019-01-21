import { combineReducers } from 'redux';

import { LookupsAction } from './all/actions';
import { reducer as all, State as LookupsState } from './all/reducer';
import {
    Action as CommissionTypesAction, reducer as commissionTypes, State as CommissionTypesState
} from './commissionTypes/reducer';
import { Action as CompaniesAction, reducer as companies, State as CompaniesState } from './companies/reducer';

export type Action = CompaniesAction | CommissionTypesAction | LookupsAction;

export type State = {
    all: LookupsState;
    companies: CompaniesState;
    commissionTypes: CommissionTypesState;
};

export const reducer = combineReducers({
    all: all,
    companies: companies,
    commissionTypes: commissionTypes
});
