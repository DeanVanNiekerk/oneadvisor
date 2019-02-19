import { combineReducers } from 'redux';

import { Action as CommissionsAction, reducer as commissions, State as CommissionsState } from './commissions/reducer';
import { Action as ErrorsAction, reducer as errors, State as ErrorsState } from './errors/reducer';
import { ImportCommissionAction } from './import/actions';
import { reducer as commissionImport, State as CommissionImportState } from './import/reducer';
import { Action as StatementsAction, reducer as statements, State as StatementsState } from './statements/reducer';

export type Action =
    | CommissionsAction
    | ImportCommissionAction
    | StatementsAction
    | ErrorsAction;

export type State = {
    commissions: CommissionsState;
    import: CommissionImportState;
    statements: StatementsState;
    errors: ErrorsState;
};

export const reducer = combineReducers({
    commissions: commissions,
    import: commissionImport,
    statements: statements,
    errors: errors
});
