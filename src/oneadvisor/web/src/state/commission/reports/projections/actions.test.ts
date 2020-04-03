import { commissionReportsApi } from "@/config/api/commission";

import { PastRevenueCommissionDataFilters } from "../";
import * as actions from "./actions";

describe("reports: projections: list actions", () => {
    it("should dispatch API when fetchPastRevenueCommissionData is called", () => {
        const filters: PastRevenueCommissionDataFilters = {
            userId: ["sup"],
        };

        const api = `${commissionReportsApi}/pastRevenueCommissionData?filters=userId%3Dsup`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_REPORT_PROJECTIONS",
        };

        expect(actions.fetchPastRevenueCommissionData(filters)).toEqual(expectedAction);
    });

    it("should dispatch COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: PastRevenueCommissionDataFilters = {
            userId: ["sup"],
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_PROJECTIONS_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receivePastRevenueCommissionFilters(filters)).toEqual(expectedAction);
    });
});
