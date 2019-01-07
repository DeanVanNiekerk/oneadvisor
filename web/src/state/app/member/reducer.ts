import { combineReducers } from 'redux';

import { ImportMemberAction } from './import/actions';
import { reducer as memberImport, State as MemberImportState } from './import/reducer';
import { Action as MembersAction, reducer as members, State as MembersState } from './members/reducer';

export type Action = MembersAction | ImportMemberAction;

export type State = {
    members: MembersState;
    import: MemberImportState;
};

export const reducer = combineReducers({
    members: members,
    import: memberImport
});
