import { combineReducers } from 'redux';

import { Action as CommissionsAction, reducer as commissions, State as CommissionsState } from './commissions/reducer';
import { Action as ErrorsAction, reducer as errors, State as ErrorsState } from './errors/reducer';
import { Action as StatementsAction, reducer as statements, State as StatementsState } from './statements/reducer';
import { Action as TemplatesAction, reducer as templates, State as TemplatesState } from './templates/reducer';

export type Action =
    | CommissionsAction
    | StatementsAction
    | ErrorsAction
    | TemplatesAction;

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
    templates: templates
});
