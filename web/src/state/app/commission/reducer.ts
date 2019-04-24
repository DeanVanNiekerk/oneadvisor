import { combineReducers } from 'redux';

import { reducer as allocations, State as AllocationsState } from './allocations/reducer';
import { reducer as commissions, State as CommissionsState } from './commissions/reducer';
import { reducer as errors, State as ErrorsState } from './errors/reducer';
import { reducer as lookups, State as LookupsState } from './lookups/reducer';
import { reducer as reports, State as ReportsState } from './reports/reducer';
import { reducer as statements, State as StatementsState } from './statements/reducer';
import { reducer as templates, State as TemplatesState } from './templates/reducer';

export type State = {
    commissions: CommissionsState;
    statements: StatementsState;
    errors: ErrorsState;
    templates: TemplatesState;
    reports: ReportsState;
    lookups: LookupsState;
    allocations: AllocationsState;
};

export const reducer = combineReducers({
    commissions: commissions,
    statements: statements,
    errors: errors,
    templates: templates,
    reports: reports,
    lookups: lookups,
    allocations: allocations,
});
