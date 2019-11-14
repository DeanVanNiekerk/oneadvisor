import { CommissionStatementTemplateFieldName } from "../";

type CommissionStatementTemplateFieldNameListReceiveAction = {
    type: "COMMISSIONSTATEMENTTEMPLATEFIELDNAMES_LIST_RECEIVE";
    payload: CommissionStatementTemplateFieldName[];
};

export type CommissionStatementTemplateFieldNameListAction = CommissionStatementTemplateFieldNameListReceiveAction;

export const receiveCommissionStatementTemplateFieldNames = (
    payload: CommissionStatementTemplateFieldName[]
): CommissionStatementTemplateFieldNameListAction => ({
    type: "COMMISSIONSTATEMENTTEMPLATEFIELDNAMES_LIST_RECEIVE",
    payload,
});
