import { combineReducers } from 'redux';

import { reducer as commissions, State as CommissionsState } from './commissions/reducer';
import { reducer as errors, State as ErrorsState } from './errors/reducer';
import { reducer as statements, State as StatementsState } from './statements/reducer';
import { reducer as templates, State as TemplatesState } from './templates/reducer';

export type State = {
    commissions: CommissionsState;
    statements: StatementsState;
    errors: ErrorsState;
    templates: TemplatesState;
};

export const reducer = combineReducers({
    commissions: commissions,
    statements: statements,
    errors: errors,
    templates: templates,
});
