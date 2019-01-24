import { combineReducers } from 'redux';

import { LookupsAction } from './all/actions';
import { reducer as all, State as LookupsState } from './all/reducer';
import {
    Action as CommissionTypesAction, reducer as commissionTypes, State as CommissionTypesState
} from './commissionTypes/reducer';
import { Action as CompaniesAction, reducer as companies, State as CompaniesState } from './companies/reducer';
import {
    Action as ContactTypesAction, reducer as contactTypes, State as ContactTypesState
} from './contactTypes/reducer';
import {
    Action as MarritalStatusAction, reducer as marritalStatus, State as MarritalStatusState
} from './marritalStatus/reducer';
import { Action as PolicyTypesAction, reducer as policyTypes, State as PolicyTypesState } from './policyTypes/reducer';

export type Action =
    | PolicyTypesAction
    | ContactTypesAction
    | MarritalStatusAction
    | CompaniesAction
    | CommissionTypesAction
    | LookupsAction;

export type State = {
    all: LookupsState;
    companies: CompaniesState;
    commissionTypes: CommissionTypesState;
    contactTypes: ContactTypesState;
    marritalStatus: MarritalStatusState;
    policyTypes: PolicyTypesState;
};

export const reducer = combineReducers({
    all: all,
    companies: companies,
    commissionTypes: commissionTypes,
    marritalStatus: marritalStatus,
    contactTypes: contactTypes,
    policyTypes: policyTypes
});
