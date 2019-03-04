import { Filters, PageOptions, SortOptions } from '@/app/table';
import { statementsApi } from '@/config/api/commission';

import * as actions from './actions';

describe("error: errors: list actions", () => {
    it("should dispatch API when fetchErrors is called", () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10,
        };

        const sortOptions: SortOptions = {
            column: "number",
            direction: "desc",
        };

        const api = `${statementsApi}/99/errors?pageNumber=${
            pageOptions.number
        }&pageSize=${pageOptions.size}&sortColumn=number&sortDirection=desc`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_ERRORS_LIST",
        };

        expect(actions.fetchErrors("99", pageOptions, sortOptions)).toEqual(
            expectedAction
        );
    });

    it("should dispatch COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options = {
            number: 10,
            size: 20,
        };

        const expectedAction = {
            type: "COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receivePageOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options: SortOptions = {
            direction: "desc",
            column: "firstName",
        };

        const expectedAction = {
            type: "COMMISSIONS_ERRORS_LIST_SORT_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receiveSortOptions(options)).toEqual(expectedAction);
    });
});
