import { PageOptions, SortOptions } from "@/app/table";
import { commissionReportsApi } from "@/config/api/commission";

import * as actions from "./actions";
import { CommissionLapseDataFilters } from "./types";

describe("reports: commissionLapse: list actions", () => {
    it("should dispatch API when fetchCommissionLapseData is called", () => {

        const pageOptions: PageOptions = {
            number: 2,
            size: 10,
        };

        const sortOptions: SortOptions = {
            column: "firstName",
            direction: "desc",
        };

        const filters: CommissionLapseDataFilters = {
            userId: ["sup"],
        };

        const api = `${commissionReportsApi}/commissionLapseData?pageNumber=${pageOptions.number}&pageSize=${
            pageOptions.size
            }&sortColumn=firstName&sortDirection=desc&filters=userId%3Dsup`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_REPORT_COMMISSIONLAPSE",
        };

        expect(actions.fetchCommissionLapseData(pageOptions, sortOptions, filters)).toEqual(
            expectedAction
        );
    });

    it("should dispatch COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: CommissionLapseDataFilters = {
            userId: ["sup"],
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_COMMISSIONLAPSE_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveCommissionLapseFilters(filters)).toEqual(expectedAction);
    });
});
