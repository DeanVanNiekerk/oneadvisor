import { CommissionStatementTemplateGroupFieldNameListState } from "../";
import { CommissionStatementTemplateGroupFieldNameListAction } from "./actions";

export const defaultState: CommissionStatementTemplateGroupFieldNameListState = {
    items: [],
};

export const reducer = (
    state: CommissionStatementTemplateGroupFieldNameListState = defaultState,
    action: CommissionStatementTemplateGroupFieldNameListAction
): CommissionStatementTemplateGroupFieldNameListState => {
    switch (action.type) {
        case "COMMISSIONSTATEMENTTEMPLATEGROUPFIELDNAMES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
            };
        }
        default:
            return state;
    }
};
