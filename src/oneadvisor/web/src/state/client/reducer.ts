import { combineReducers } from "redux";

import { reducer as clients } from "./clients/reducer";
import { reducer as contacts } from "./contacts/reducer";
import { reducer as clientImport } from "./import/reducer";
import { reducer as lookups } from "./lookups/reducer";
import { reducer as policies } from "./policies/reducer";
import { ClientState } from "./types";

export const reducer = combineReducers<ClientState>({
    clients: clients,
    import: clientImport,
    policies: policies,
    contacts: contacts,
    lookups: lookups,
});
