import { combineReducers } from 'redux';

import { reducer as all, State as LookupsState } from './all/reducer';
import {
    reducer as commissionStatementTemplateFieldNames, State as CommissionStatementTemplateFieldNamesState
} from './commissionStatementTemplateFieldNames/reducer';
import { reducer as commissionTypes, State as CommissionTypesState } from './commissionTypes/reducer';
import { reducer as companies, State as CompaniesState } from './companies/reducer';
import { reducer as contactTypes, State as ContactTypesState } from './contactTypes/reducer';
import { reducer as marritalStatus, State as MarritalStatusState } from './marritalStatus/reducer';
import { reducer as policyTypes, State as PolicyTypesState } from './policyTypes/reducer';

export type State = {
    all: LookupsState;
    companies: CompaniesState;
    commissionTypes: CommissionTypesState;
    contactTypes: ContactTypesState;
    marritalStatus: MarritalStatusState;
    policyTypes: PolicyTypesState;
    commissionStatementTemplateFieldNames: CommissionStatementTemplateFieldNamesState;
};

export const reducer = combineReducers({
    all: all,
    companies: companies,
    commissionTypes: commissionTypes,
    marritalStatus: marritalStatus,
    contactTypes: contactTypes,
    policyTypes: policyTypes,
    commissionStatementTemplateFieldNames: commissionStatementTemplateFieldNames,
});
