import { ContactType } from '../types';
import { ContactTypeListAction } from './actions';

export type State = {
    readonly items: ContactType[];
};

export const defaultState: State = {
    items: []
};

export const reducer = (
    state: State = defaultState,
    action: ContactTypeListAction
): State => {
    switch (action.type) {
        case 'CONTACTTYPES_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload
            };
        }
        default:
            return state;
    }
};
