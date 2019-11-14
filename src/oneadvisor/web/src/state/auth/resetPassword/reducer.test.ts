import { defaultState, reducer } from "./reducer";

describe("reset password reducer", () => {
    it("should handle AUTH_RESETPASSWORD_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "AUTH_RESETPASSWORD_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle AUTH_RESETPASSWORD_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "AUTH_RESETPASSWORD_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle AUTH_TOKEN_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "AUTH_RESETPASSWORD_RECEIVE",
            payload: {
                success: true,
                errors: [],
                validationFailures: [],
                tag: null,
            },
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
