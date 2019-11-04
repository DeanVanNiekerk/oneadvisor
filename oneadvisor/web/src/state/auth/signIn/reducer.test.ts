import { defaultState, reducer } from "./reducer";

describe("sign in reducer", () => {
    it("should handle AUTH_SIGNIN_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "AUTH_SIGNIN_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle AUTH_SIGNIN_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "AUTH_SIGNIN_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle AUTH_SIGNIN_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const token = "123";

        const actualState = reducer(initalState, {
            type: "AUTH_SIGNIN_RECEIVE",
            payload: {
                token: token,
            },
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
