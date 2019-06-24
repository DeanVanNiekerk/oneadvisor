import { defaultState, reducer } from './reducer';

describe("client lookups reducer", () => {
    it("should handle CLIENT_LOOKUPS_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "CLIENT_LOOKUPS_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENT_LOOKUPS_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENT_LOOKUPS_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENT_LOOKUPS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENT_LOOKUPS_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
