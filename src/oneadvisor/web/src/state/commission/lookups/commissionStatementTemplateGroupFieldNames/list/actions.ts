import { CommissionStatementTemplateGroupFieldName } from "../";

type CommissionStatementTemplateGroupFieldNameListReceiveAction = {
    type: "COMMISSIONSTATEMENTTEMPLATEGROUPFIELDNAMES_LIST_RECEIVE";
    payload: CommissionStatementTemplateGroupFieldName[];
};

export type CommissionStatementTemplateGroupFieldNameListAction = CommissionStatementTemplateGroupFieldNameListReceiveAction;

export const receiveCommissionStatementTemplateGroupFieldNames = (
    payload: CommissionStatementTemplateGroupFieldName[]
): CommissionStatementTemplateGroupFieldNameListAction => ({
    type: "COMMISSIONSTATEMENTTEMPLATEGROUPFIELDNAMES_LIST_RECEIVE",
    payload,
});
