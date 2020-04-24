import { ClientTypeId } from "@/state/lookups/client";

import { Client } from "../";
import { defaultState, reducer } from "./reducer";

describe("client search reducer", () => {
    it("should handle CLIENTS_SEARCH_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "CLIENTS_SEARCH_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_SEARCH_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_SEARCH_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_SEARCH_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const client: Client = {
            id: "10",
            clientTypeId: ClientTypeId.Individual,
            firstName: "Dean",
            lastName: "Jackson",
            maidenName: "",
            initials: "DJ",
            preferredName: "ripper",
            idNumber: "12341234",
            alternateIdNumber: "987987",
            dateOfBirth: "1982-10-03",
            marriageDate: "1982-10-02",
            marritalStatusId: "987654",
            taxNumber: "AABB1212",
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_SEARCH_RECEIVE",
            payload: {
                totalItems: 1,
                items: [client],
            },
        });

        const expectedState = {
            ...defaultState,
            items: [client],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
