import { defaultState, reducer } from "./reducer";

describe("report user monthly commission reducer", () => {
    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_YEAR_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_YEAR_RECEIVE",
            payload: 1999,
        });

        const expectedState = {
            ...defaultState,
            year: 1999,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_MONTH_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_MONTH_RECEIVE",
            payload: 10,
        });

        const expectedState = {
            ...defaultState,
            month: 10,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_TYPE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSIONS_REPORT_USER_MONTHLY_COMMISSION_TYPE_RECEIVE",
            payload: "Last12Months",
        });

        const expectedState = {
            ...defaultState,
            type: "Last12Months",
        };

        expect(actualState).toEqual(expectedState);
    });
});
