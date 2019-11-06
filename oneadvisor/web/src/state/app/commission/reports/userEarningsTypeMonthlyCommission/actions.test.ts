import { UserEarningsTypeMonthlyCommissionFilters } from "../";
import * as actions from "./actions";

describe("reports: user monthly commission: list actions", () => {
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
