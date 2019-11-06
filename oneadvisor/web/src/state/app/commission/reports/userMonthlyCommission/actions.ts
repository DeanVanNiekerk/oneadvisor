import moment from "moment";
import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";

import { downloadExcelSheets } from "@/app/excel/helpers";
import { SERVER_DATE_FORMAT } from "@/app/utils";
import { companiesSelector, getCompanyName } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";

import {
    receiveUserEarningsTypeMonthlyCommissionFilters,
    userCompanyMonthlyCommissionSelector,
    userEarningsTypeMonthlyCommissionSelector,
} from "../";
import { commissionEarningsTypesSelector, getCommissionEarningsTypeName } from "../../lookups";
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

export const downloadUserMonthlyCommissionExcel = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return (dispatch, getState) => {
        let fileName = "BrokerCommission";

        const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(getState());
        const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(getState());

        const companiesState = companiesSelector(getState());
        const commissionEarningsTypesState = commissionEarningsTypesSelector(getState());

        const startDate = userEarningsTypeMonthlyCommissionState.filters.startDate;
        const start = startDate ? startDate[0] : "";

        const endDate = userEarningsTypeMonthlyCommissionState.filters.endDate;
        const end = endDate ? endDate[0] : "";

        fileName += `_${start}_${end}.xlsx`;

        downloadExcelSheets(
            [
                {
                    name: "Earnings Types",
                    data: userEarningsTypeMonthlyCommissionState.items.map(d => ({
                        earningsType: getCommissionEarningsTypeName(
                            d.commissionEarningsTypeId,
                            commissionEarningsTypesState.items
                        ),
                        amountExcludingVAT: d.amountExcludingVAT,
                    })),
                },
                {
                    name: "Company",
                    data: userCompanyMonthlyCommissionState.items.map(d => ({
                        company: getCompanyName(d.companyId, companiesState.items),
                        amountExcludingVAT: d.amountExcludingVAT,
                    })),
                },
            ],
            fileName
        );
    };
};
