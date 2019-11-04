import { Filters, PageOptions, SortOptions } from "@/app/table";
import { policiesApi } from "@/config/api/client";

import * as actions from "./actions";

describe("policy: policies: list actions", () => {
    it("should dispatch POLICIES_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options = {
            number: 10,
            size: 20,
        };

        const expectedAction = {
            type: "POLICIES_LIST_PAGE_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receivePageOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch POLICIES_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options: SortOptions = {
            direction: "desc",
            column: "firstName",
        };

        const expectedAction = {
            type: "POLICIES_LIST_SORT_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receiveSortOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch POLICIES_LIST_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: Filters = {
            firstName: ["sup"],
        };

        const expectedAction = {
            type: "POLICIES_LIST_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveFilters(filters)).toEqual(expectedAction);
    });
});
