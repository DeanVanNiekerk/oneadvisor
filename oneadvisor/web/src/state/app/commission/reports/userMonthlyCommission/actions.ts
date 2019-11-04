import { UserMonthlyCommissionType } from "./types";

type UserMonthlyCommissionYearReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_YEAR_RECEIVE";
    payload: number;
};

type UserMonthlyCommissionMonthReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_MONTH_RECEIVE";
    payload: number;
};

type UserMonthlyCommissionUserMonthlyCommissionTypeReceiveAction = {
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_TYPE_RECEIVE";
    payload: UserMonthlyCommissionType;
};

export type UserMonthlyCommissionAction =
    | UserMonthlyCommissionYearReceiveAction
    | UserMonthlyCommissionMonthReceiveAction
    | UserMonthlyCommissionUserMonthlyCommissionTypeReceiveAction;

export const receiveUserMonthlyCommissionYear = (year: number): UserMonthlyCommissionYearReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_YEAR_RECEIVE",
    payload: year,
});

export const receiveUserMonthlyCommissionMonth = (month: number): UserMonthlyCommissionMonthReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_MONTH_RECEIVE",
    payload: month,
});

export const receiveUserMonthlyCommissionUserMonthlyCommissionType = (
    option: UserMonthlyCommissionType
): UserMonthlyCommissionUserMonthlyCommissionTypeReceiveAction => ({
    type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_TYPE_RECEIVE",
    payload: option,
});
