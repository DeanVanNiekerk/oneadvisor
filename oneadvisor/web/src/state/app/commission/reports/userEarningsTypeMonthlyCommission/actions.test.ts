import { commissionReportsApi } from "@/config/api/commission";

import { UserEarningsTypeMonthlyCommissionFilters } from "../";
import * as actions from "./actions";

describe("reports: user monthly commission: list actions", () => {
    it("should dispatch API when fetchUserEarningsTypeMonthlyCommissionData is called", () => {
        const filters: UserEarningsTypeMonthlyCommissionFilters = {
            userId: ["123"],
        };

        const api = `${commissionReportsApi}/userEarningsTypeMonthlyCommissionData?filters=userId%3D123`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION",
        };

        expect(actions.fetchUserEarningsTypeMonthlyCommissionData(filters)).toEqual(expectedAction);
    });

    it("should dispatch COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: UserEarningsTypeMonthlyCommissionFilters = {
            userId: ["1"],
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_USER_EARNINGSTYPE_MONTHLY_COMMISSION_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveUserEarningsTypeMonthlyCommissionFilters(filters)).toEqual(expectedAction);
    });
});
