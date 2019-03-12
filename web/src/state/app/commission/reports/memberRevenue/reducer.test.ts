import { Filters, SortOptions } from '@/app/table';

import { defaultState, reducer } from './reducer';
import { MemberRevenueData } from './types';

describe("report member revenue reducer", () => {
    it("should handle COMMISSIONS_REPORT_MEM_REVENUE_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_MEM_REVENUE_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_MEM_REVENUE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const data: MemberRevenueData = {
            rowNumber: 1,
            memberId: "123321",
            memberLastName: "van Niekerk",
            memberInitials: "Dean",
            memberDateOfBirth: "1982-10-03",
            annualAnnuityAverage: 10,
            grandTotal: 20,
            lifeFirstYears: 30,
            monthlyAnnuityMonth: 40,
            onceOff: 50,
            totalMonthlyEarnings: 60,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_RECEIVE",
            payload: {
                totalItems: 1,
                items: [data],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [data],
            totalItems: 1,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options = {
            number: 9,
            size: 20,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_PAGE_OPTIONS_RECEIVE",
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

    it("should handle COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const options: SortOptions = {
            direction: "asc",
            column: "colName",
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_SORT_OPTIONS_RECEIVE",
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

    it("should handle COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: Filters = {
            firstName: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_MEM_REVENUE_FILTERS_RECEIVE",
            payload: filters,
        });

        const expectedState = {
            ...defaultState,
            filters: {
                ...filters,
            },
        };

        expect(actualState).toEqual(expectedState);
    });
});
