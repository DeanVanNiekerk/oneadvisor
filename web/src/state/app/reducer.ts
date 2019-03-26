import { combineReducers } from 'redux';

import { reducer as client, State as ClientState } from './client/reducer';
import { reducer as commission, State as CommissionState } from './commission/reducer';
import { reducer as directory, State as DirectoryState } from './directory/reducer';

export type State = {
    directory: DirectoryState;
    client: ClientState;
    commission: CommissionState;
};

export const reducer = combineReducers({
    directory: directory,
    client: client,
    commission: commission,
});
