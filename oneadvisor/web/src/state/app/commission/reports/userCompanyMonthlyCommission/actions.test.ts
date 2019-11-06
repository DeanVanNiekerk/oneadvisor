import { UserCompanyMonthlyCommissionFilters } from "../";
import * as actions from "./actions";

describe("reports: user monthly commission: list actions", () => {
    it("should dispatch COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: UserCompanyMonthlyCommissionFilters = {
            userId: ["123"],
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveUserCompanyMonthlyCommissionFilters(filters)).toEqual(expectedAction);
    });
});
