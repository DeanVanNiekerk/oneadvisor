import { Filters, SortOptions } from '@/app/table';

import { defaultState, reducer } from './reducer';
import { UserMonthlyCommissionData } from './types';

describe("report user monthly commission reducer", () => {
    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const data: UserMonthlyCommissionData = {
            userId: "123321",
            userLastName: "van Niekerk",
            userFirstName: "Dean",
            month: 1,
            year: 1999,
            monthlyAnnuity: 40,
            annualAnnuity: 10,
            lifeFirstYears: 30,
            onceOff: 50,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_RECEIVE",
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

    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FILTERS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const filters: Filters = {
            firstName: ["sup"],
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_FILTERS_RECEIVE",
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
