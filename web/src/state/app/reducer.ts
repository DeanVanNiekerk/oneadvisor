import { combineReducers } from 'redux';

import { Action as CommisionAction, reducer as commission, State as CommissionState } from './commission/reducer';
import { Action as DirectoryAction, reducer as directory, State as DirectoryState } from './directory/reducer';
import { Action as MemberAction, reducer as member, State as MemberState } from './member/reducer';

export type Action = DirectoryAction | MemberAction | CommisionAction;

export type State = {
    directory: DirectoryState;
    member: MemberState;
    commission: CommissionState;
};

export const reducer = combineReducers({
    directory: directory,
    member: member,
    commission: commission
});
