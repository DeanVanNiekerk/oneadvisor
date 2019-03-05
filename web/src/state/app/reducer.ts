import { combineReducers } from 'redux';

import { reducer as commission, State as CommissionState } from './commission/reducer';
import { reducer as directory, State as DirectoryState } from './directory/reducer';
import { reducer as member, State as MemberState } from './member/reducer';

export type State = {
    directory: DirectoryState;
    member: MemberState;
    commission: CommissionState;
};

export const reducer = combineReducers({
    directory: directory,
    member: member,
    commission: commission,
});
