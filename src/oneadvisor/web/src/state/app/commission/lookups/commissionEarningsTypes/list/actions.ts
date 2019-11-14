import { CommissionEarningsType } from "../types";

type CommissionEarningsTypeListReceiveAction = {
    type: "COMMISSIONEARNINGSTYPE_LIST_RECEIVE";
    payload: CommissionEarningsType[];
};

export type CommissionEarningsTypeListAction = CommissionEarningsTypeListReceiveAction;

export const receiveCommissionEarningsTypes = (
    payload: CommissionEarningsType[]
): CommissionEarningsTypeListAction => ({
    type: "COMMISSIONEARNINGSTYPE_LIST_RECEIVE",
    payload,
});
