import { CommissionStatementTemplateFieldName } from '../';
import { CommissionStatementTemplateFieldNameListAction } from './actions';

export type State = {
    readonly items: CommissionStatementTemplateFieldName[];
};

export const defaultState: State = {
    items: []
};

export const reducer = (
    state: State = defaultState,
    action: CommissionStatementTemplateFieldNameListAction
): State => {
    switch (action.type) {
        case 'COMMISSIONSTATEMENTTEMPLATEFIELDNAMES_LIST_RECEIVE': {
            return {
                ...state,
                items: action.payload
            };
        }
        default:
            return state;
    }
};
