import { Filters, PageOptions, SortOptions } from '@/app/table';
import { clientsApi } from '@/config/api/client';

import * as actions from './actions';

describe("client: clients: list actions", () => {
    it("should dispatch API when fetchClients is called", () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10,
        };

        const sortOptions: SortOptions = {
            column: "firstName",
            direction: "desc",
        };

        const filters: Filters = {
            lastName: ["van"],
        };

        const api = `${clientsApi}?pageNumber=${pageOptions.number}&pageSize=${
            pageOptions.size
        }&sortColumn=firstName&sortDirection=desc&filters=lastName%3Dvan`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "CLIENTS_LIST",
        };

        expect(actions.fetchClients(pageOptions, sortOptions, filters)).toEqual(
            expectedAction
        );
    });

    it("should dispatch CLIENTS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options = {
            number: 10,
            size: 20,
        };

        const expectedAction = {
            type: "CLIENTS_LIST_PAGE_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receivePageOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options: SortOptions = {
            direction: "desc",
            column: "firstName",
        };

        const expectedAction = {
            type: "CLIENTS_LIST_SORT_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receiveSortOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_LIST_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: Filters = {
            firstName: ["sup"],
        };

        const expectedAction = {
            type: "CLIENTS_LIST_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveFilters(filters)).toEqual(expectedAction);
    });
});