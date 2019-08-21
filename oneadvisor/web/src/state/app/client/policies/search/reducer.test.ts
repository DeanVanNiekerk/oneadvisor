import { Policy } from "../";
import { defaultState, reducer } from "./reducer";

describe("policy search reducer", () => {
    it("should handle POLICIES_SEARCH_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "POLICIES_SEARCH_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICIES_SEARCH_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_SEARCH_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle POLICIES_SEARCH_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const policy: Policy = {
            id: "10",
            clientId: "12",
            companyId: "100",
            userId: "1",
            number: "987654",
            userFullName: "Dean van Niekerk",
            premium: 500,
            startDate: "1999-01-01",
            policyTypeId: "123321",
            policyProductTypeId: "00111",
            policyProductId: "99988777",
            clientLastName: "Jones",
            clientInitials: "DJ",
            clientDateOfBirth: "1982-10-03",
            isActive: true,
        };

        const actualState = reducer(initalState, {
            type: "POLICIES_SEARCH_RECEIVE",
            payload: {
                totalItems: 1,
                items: [policy],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [policy],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
