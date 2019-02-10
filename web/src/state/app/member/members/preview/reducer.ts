import { MemberPreview } from '../types';
import { MemberPreviewAction } from './actions';

export type State = {
    readonly member: MemberPreview | null;
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    member: null,
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: MemberPreviewAction
): State => {
    switch (action.type) {
        case 'MEMBERS_MEMBER_PREVIEW_RECEIVE': {
            return {
                ...state,
                member: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'MEMBERS_MEMBER_PREVIEW_FETCHING': {
            return {
                ...state,
                fetching: true
            };
        }
        case 'MEMBERS_MEMBER_PREVIEW_FETCHING_ERROR': {
            return {
                ...state,
                member: null,
                fetching: false,
                error: true
            };
        }
        default:
            return state;
    }
};
