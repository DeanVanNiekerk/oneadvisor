import { combineReducers } from 'redux';

import { reducer as all, State as LookupsState } from './all/reducer';
import {
    reducer as commissionEarningsTypes, State as CommissionEarningsTypesState
} from './commissionEarningsTypes/reducer';
import {
    reducer as commissionStatementTemplateFieldNames, State as CommissionStatementTemplateFieldNamesState
} from './commissionStatementTemplateFieldNames/reducer';
import { reducer as commissionTypes, State as CommissionTypesState } from './commissionTypes/reducer';

export type State = {
    all: LookupsState;
    commissionTypes: CommissionTypesState;
    commissionStatementTemplateFieldNames: CommissionStatementTemplateFieldNamesState;
    commissionEarningsTypes: CommissionEarningsTypesState;
};

export const reducer = combineReducers({
    all: all,
    commissionTypes: commissionTypes,
    commissionStatementTemplateFieldNames: commissionStatementTemplateFieldNames,
    commissionEarningsTypes: commissionEarningsTypes,
});
