import { combineReducers } from 'redux';

import { Action as CommissionsAction, reducer as commissions, State as CommissionsState } from './commissions/reducer';
import { ImportCommissionAction } from './import/actions';
import { reducer as commissionImport, State as CommissionImportState } from './import/reducer';

export type Action = CommissionsAction | ImportCommissionAction;

export type State = {
    commissions: CommissionsState;
    import: CommissionImportState;
};

export const reducer = combineReducers({
    commissions: commissions,
    import: commissionImport
});
