import { combineReducers } from 'redux';

import { reducer as contacts, State as ContactsState } from './contacts/reducer';
import { reducer as memberImport, State as MemberImportState } from './import/reducer';
import { reducer as members, State as MembersState } from './members/reducer';
import { reducer as policies, State as PoliciesState } from './policies/reducer';

export type State = {
    members: MembersState;
    import: MemberImportState;
    policies: PoliciesState;
    contacts: ContactsState;
};

export const reducer = combineReducers({
    members: members,
    import: memberImport,
    policies: policies,
    contacts: contacts,
});
