import { Filters } from '@/app/table';
import { commissionReportsApi } from '@/config/api/commission';

import * as actions from './actions';

describe("reports: user monthly commission: list actions", () => {
    it("should dispatch API when fetchCommissions is called", () => {
        const filters: Filters = {
            number: ["123"],
        };

        const api = `${commissionReportsApi}/userCompanyMonthlyCommissionData?filters=number%3D123`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix:
                "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION",
        };

        expect(actions.fetchUserCompanyMonthlyCommissionData(filters)).toEqual(
            expectedAction
        );
    });

    it("should dispatch COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: Filters = {
            firstName: ["sup"],
        };

        const expectedAction = {
            type:
                "COMMISSIONS_REPORT_USER_COMPANY_MONTHLY_COMMISSION_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(
            actions.receiveUserCompanyMonthlyCommissionFilters(filters)
        ).toEqual(expectedAction);
    });
});
