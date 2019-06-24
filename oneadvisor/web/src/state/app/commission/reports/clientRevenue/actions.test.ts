import { Filters, PageOptions, SortOptions } from '@/app/table';
import { commissionReportsApi } from '@/config/api/commission';

import * as actions from './actions';

describe("reports: client revenue: list actions", () => {
    it("should dispatch API when fetchCommissions is called", () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10,
        };

        const sortOptions: SortOptions = {
            column: "number",
            direction: "desc",
        };

        const filters: Filters = {
            number: ["123"],
        };

        const api = `${commissionReportsApi}/clientRevenueData?pageNumber=${
            pageOptions.number
        }&pageSize=${
            pageOptions.size
        }&sortColumn=number&sortDirection=desc&filters=number%3D123`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_REPORT_MEM_REVENUE",
        };

        expect(
            actions.fetchClientRevenueData(pageOptions, sortOptions, filters)
        ).toEqual(expectedAction);
    });

    it("should dispatch COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options = {
            number: 10,
            size: 20,
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receiveClientRevenuePageOptions(options)).toEqual(
            expectedAction
        );
    });

    it("should dispatch COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options: SortOptions = {
            direction: "desc",
            column: "firstName",
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receiveClientRevenueSortOptions(options)).toEqual(
            expectedAction
        );
    });

    it("should dispatch COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: Filters = {
            firstName: ["sup"],
        };

        const expectedAction = {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveClientRevenueFilters(filters)).toEqual(
            expectedAction
        );
    });
});
