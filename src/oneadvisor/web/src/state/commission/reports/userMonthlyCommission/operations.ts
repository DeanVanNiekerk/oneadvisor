import dayjs from "dayjs";
import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { downloadExcelSheets } from "@/app/excel/helpers";
import { SERVER_DATE_FORMAT } from "@/app/utils";
import { policyTypesSelector } from "@/state/lookups/client";
import { companiesSelector, usersSimpleSelector } from "@/state/lookups/directory";
import { RootState } from "@/state/types";

import {
    userCompanyMonthlyCommissionSelector,
    userEarningsTypeMonthlyCommissionSelector,
} from "../";
import { getCommissions } from "../../commissions";
import { Commission, CommissionFilters } from "../../commissions/types";
import { commissionEarningsTypesSelector, commissionTypesSelector } from "../../lookups";

type Dispatch = ThunkDispatch<RootState, {}, AnyAction>;

export const downloadUserMonthlyCommissionExcel = (
    onComplete: () => void
): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        let fileName = "BrokerCommission";

        const state = getState();

        const userEarningsTypeMonthlyCommissionState = userEarningsTypeMonthlyCommissionSelector(
            state
        );
        const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);

        const companiesState = companiesSelector(state);
        const companiesMap = companiesState.items.reduce((p, c) => {
            return {
                ...p,
                [c.id]: c.name,
            };
        }, {});

        const commissionEarningsTypesState = commissionEarningsTypesSelector(state);
        const commissionEarningsTypesMap = commissionEarningsTypesState.items.reduce((p, c) => {
            return {
                ...p,
                [c.id]: c.name,
            };
        }, {});

        const commissionTypesState = commissionTypesSelector(state);
        const commissionTypesMap = commissionTypesState.items.reduce((p, c) => {
            return {
                ...p,
                [c.id]: c.name,
            };
        }, {});

        const usersState = usersSimpleSelector(state);
        const usersMap = usersState.items.reduce((p, u) => {
            return {
                ...p,
                [u.id]: u.fullName,
            };
        }, {});

        const policyTypes = policyTypesSelector(state);
        const policyTypesMap = policyTypes.items.reduce((p, t) => {
            return {
                ...p,
                [t.id]: t.name,
            };
        }, {});

        const {
            startDate,
            endDate,
            userId,
            branchId,
            companyId,
        } = userEarningsTypeMonthlyCommissionState.filters;

        const start = startDate ? startDate[0] : "";
        const end = endDate ? endDate[0] : "";

        const userIds = userId ? userId : [];
        const companyIds = companyId ? companyId : [];
        const branchIds = branchId ? branchId : [];

        let commissions = await getCommissionEntries(
            dispatch,
            userIds,
            companyIds,
            branchIds,
            start,
            end
        );

        commissions = groupCommissionEntries(commissions);

        fileName += `_${start}_${end}.xlsx`;

        await downloadExcelSheets(
            [
                {
                    name: "Earnings Types",
                    data: userEarningsTypeMonthlyCommissionState.items.map((d) => ({
                        "Earnings Type": commissionEarningsTypesMap[d.commissionEarningsTypeId],
                        "Amount Excluding VAT": d.amountExcludingVAT.toFixed(2),
                    })),
                },
                {
                    name: "Company",
                    data: userCompanyMonthlyCommissionState.items.map((d) => ({
                        Company: companiesMap[d.companyId],
                        "Amount Excluding VAT": d.amountExcludingVAT.toFixed(2),
                    })),
                },
                {
                    name: "Commission",
                    data: commissions.map((c) => ({
                        Date: dayjs(c.commissionStatementDate).format(SERVER_DATE_FORMAT),
                        "Client Last Name": c.policyClientLastName,
                        "Client Initials": c.policyClientInitials,
                        Company: companiesMap[c.policyCompanyId],
                        "Policy Number": c.policyNumber,
                        "Policy Type": policyTypesMap[c.policyTypeId || "no-value"],
                        "Commission Type": commissionTypesMap[c.commissionTypeId],
                        Broker: usersMap[c.userId],
                        "Is Split": c.splitGroupId ? "Yes" : "No",
                        "Amount Excl. VAT": (c.amountIncludingVAT - c.vat).toFixed(2),
                    })),
                },
            ],
            fileName
        );

        onComplete();
    };
};

type GroupedCommissions = {
    [key in string]: Commission;
};

//Group by Company, CommissionType and PolicyNumber
const groupCommissionEntries = (commissions: Commission[]): Commission[] => {
    const grouped = commissions.reduce<GroupedCommissions>((p, c) => {
        const key = `${c.policyCompanyId};${c.commissionTypeId};${c.policyNumber}`;
        if (!p[key]) {
            p[key] = c;
        } else {
            p[key] = {
                ...c,
                amountIncludingVAT: c.amountIncludingVAT + p[key].amountIncludingVAT,
                vat: c.vat + p[key].vat,
            };
        }

        return p;
    }, {});

    return Object.values(grouped);
};

const getCommissionEntries = async (
    dispatch: Dispatch,
    userIds: string[],
    companyIds: string[],
    branchIds: string[],
    startDate: string,
    endDate: string
): Promise<Commission[]> => {
    const filters: CommissionFilters = {
        startDate: [startDate],
        endDate: [endDate],
        userId: userIds,
        branchId: branchIds,
        policyCompanyId: companyIds,
    };

    return new Promise((resolve) => {
        dispatch(
            getCommissions(filters, (commissions) => {
                resolve(commissions);
            })
        );
    });
};
