import { combineReducers } from 'redux';

import { LookupsAction } from './all/actions';
import { reducer as all, State as LookupsState } from './all/reducer';
import {
    Action as CommissionTypesAction, reducer as commissionTypes, State as CommissionTypesState
} from './commissionTypes/reducer';
import { Action as CompaniesAction, reducer as companies, State as CompaniesState } from './companies/reducer';
import {
    Action as MarritalStatusAction, reducer as marritalStatus, State as MarritalStatusState
} from './marritalStatus/reducer';

export type Action =
    | MarritalStatusAction
    | CompaniesAction
    | CommissionTypesAction
    | LookupsAction;

export type State = {
    all: LookupsState;
    companies: CompaniesState;
    commissionTypes: CommissionTypesState;
    marritalStatus: MarritalStatusState;
};

export const reducer = combineReducers({
    all: all,
    companies: companies,
    commissionTypes: commissionTypes,
    marritalStatus: marritalStatus
});
