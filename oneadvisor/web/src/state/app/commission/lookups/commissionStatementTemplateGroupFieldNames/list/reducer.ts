import { CommissionStatementTemplateGroupFieldName } from "../";
import { CommissionStatementTemplateGroupFieldNameListAction } from "./actions";

export type State = {
	readonly items: CommissionStatementTemplateGroupFieldName[];
};

export const defaultState: State = {
	items: [],
};

export const reducer = (
	state: State = defaultState,
	action: CommissionStatementTemplateGroupFieldNameListAction
): State => {
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
