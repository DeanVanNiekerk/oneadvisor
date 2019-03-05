import { Filters, SortOptions } from '@/app/table';

import { CommissionError } from '../';
import { defaultState, reducer } from './reducer';

const defaultCommissionError: CommissionError = {
    id: "10",
    commissionStatementId: "321",
    policyId: "12",
    memberId: "13",
    commissionTypeId: "14",
    data: {
        policyNumber: "123-123",
        amountIncludingVAT: "50",
        vat: "5",
        commissionTypeCode: "gap_cover",
    },
    isFormatValid: false,
};

describe("error list reducer", () => {
    it("should handle COMMISSIONS_ERRORS_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_ERRORS_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERRORS_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERRORS_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERRORS_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERRORS_LIST_RECEIVE",
            payload: {
                totalItems: 1,
                items: [defaultCommissionError],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [defaultCommissionError],
            totalItems: 1,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE",
            payload: options,
        });

        const expectedState = {
            ...defaultState,
            pageOptions: {
                ...options,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_ERRORS_LIST_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_ERRORS_LIST_SORT_OPTIONS_RECEIVE",
            payload: options,
        });

        const expectedState = {
            ...defaultState,
            sortOptions: {
                ...options,
            },
        };

        expect(actualState).toEqual(expectedState);
    });
});
