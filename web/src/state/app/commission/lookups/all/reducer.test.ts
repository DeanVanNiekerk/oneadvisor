import { defaultState, reducer } from './reducer';

describe("commission lookups reducer", () => {
    it("should handle COMMISSION_LOOKUPS_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "COMMISSION_LOOKUPS_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSION_LOOKUPS_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSION_LOOKUPS_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMMISSION_LOOKUPS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "COMMISSION_LOOKUPS_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
