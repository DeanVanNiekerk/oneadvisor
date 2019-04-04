import { combineReducers } from 'redux';

import { reducer as all, State as LookupsState } from './all/reducer';
import { reducer as clientTypes, State as ClientTypesState } from './clientTypes/reducer';
import { reducer as contactTypes, State as ContactTypesState } from './contactTypes/reducer';
import { reducer as marritalStatus, State as MarritalStatusState } from './marritalStatus/reducer';
import { reducer as policyProductTypes, State as PolicyProductTypesState } from './policyProductTypes/reducer';
import { reducer as policyTypes, State as PolicyTypesState } from './policyTypes/reducer';

export type State = {
    all: LookupsState;
    contactTypes: ContactTypesState;
    marritalStatus: MarritalStatusState;
    policyTypes: PolicyTypesState;
    clientTypes: ClientTypesState;
    policyProductTypes: PolicyProductTypesState;
};

export const reducer = combineReducers({
    all: all,
    marritalStatus: marritalStatus,
    contactTypes: contactTypes,
    policyTypes: policyTypes,
    clientTypes: clientTypes,
    policyProductTypes: policyProductTypes,
});
