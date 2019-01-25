import { combineReducers } from 'redux';

import { Action as ContactsAction, reducer as contacts, State as ContactsState } from './contacts/reducer';
import { ImportMemberAction } from './import/actions';
import { reducer as memberImport, State as MemberImportState } from './import/reducer';
import { Action as MembersAction, reducer as members, State as MembersState } from './members/reducer';
import { Action as PoliciesAction, reducer as policies, State as PoliciesState } from './policies/reducer';

export type Action =
    | MembersAction
    | ImportMemberAction
    | PoliciesAction
    | ContactsAction;

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
    contacts: contacts
});
