import { UserType } from "../";
import { defaultState, reducer } from "./reducer";

describe("userType list reducer", () => {

    it("should handle USERTYPES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const userType: UserType = {
            id: "10",
            name: "UT1",
            displayOrder: 1,
        };

        const actualState = reducer(initalState, {
            type: "USERTYPES_LIST_RECEIVE",
            payload: [userType],
        });

        const expectedState = {
            ...defaultState,
            items: [userType],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
