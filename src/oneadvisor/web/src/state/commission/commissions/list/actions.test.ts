import { SortOptions } from "@/app/table";

import { CommissionFilters } from "../types";
import * as actions from "./actions";

describe("commission: commissions: list actions", () => {
    it("should dispatch COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options = {
            number: 10,
            size: 20,
        };

        const expectedAction = {
            type: "COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receivePageOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch COMMISSIONS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called", () => {
        const options: SortOptions = {
            direction: "desc",
            column: "firstName",
        };

        const expectedAction = {
            type: "COMMISSIONS_LIST_SORT_OPTIONS_RECEIVE",
            payload: options,
        };

        expect(actions.receiveSortOptions(options)).toEqual(expectedAction);
    });

    it("should dispatch COMMISSIONS_LIST_FILTERS_RECEIVE when receiveFilters is called", () => {
        const filters: CommissionFilters = {
            commissionTypeId: ["sup"],
        };

        const expectedAction = {
            type: "COMMISSIONS_LIST_FILTERS_RECEIVE",
            payload: filters,
        };

        expect(actions.receiveFilters(filters)).toEqual(expectedAction);
    });
});
