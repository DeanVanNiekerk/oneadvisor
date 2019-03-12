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
            RowNumber: 1,
            MemberId: "123321",
            MemberFirstName: "Dean",
            MemberLastName: "van Niekerk",
            AnnualAnnuity: 10,
            AnnualAnnuityMonth: 20,
            LifeFirstYears: 30,
            LifeFirstYearsMonth: 40,
            MonthlyAnnuity: 50,
            MonthlyAnnuityMonth: 60,
            OnceOff: 70,
            OnceOffMonth: 80,
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
