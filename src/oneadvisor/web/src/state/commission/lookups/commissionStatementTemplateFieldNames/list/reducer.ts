import { CommissionStatementTemplateFieldNameListState } from "../";
import { CommissionStatementTemplateFieldNameListAction } from "./actions";

export const defaultState: CommissionStatementTemplateFieldNameListState = {
    items: [],
};

export const reducer = (
    state: CommissionStatementTemplateFieldNameListState = defaultState,
    action: CommissionStatementTemplateFieldNameListAction
): CommissionStatementTemplateFieldNameListState => {
    switch (action.type) {
        case "COMMISSIONSTATEMENTTEMPLATEFIELDNAMES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
