import { combineReducers } from 'redux';

import { reducer as clients, State as ClientsState } from './clients/reducer';
import { reducer as contacts, State as ContactsState } from './contacts/reducer';
import { reducer as clientImport, State as ClientImportState } from './import/reducer';
import { reducer as lookups, State as LookupsState } from './lookups/reducer';
import { reducer as policies, State as PoliciesState } from './policies/reducer';

export type State = {
    clients: ClientsState;
    import: ClientImportState;
    policies: PoliciesState;
    contacts: ContactsState;
    lookups: LookupsState;
};

export const reducer = combineReducers({
    clients: clients,
    import: clientImport,
    policies: policies,
    contacts: contacts,
    lookups: lookups,
});
