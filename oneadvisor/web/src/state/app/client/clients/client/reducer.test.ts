import { getValidationResult } from "@/test";

import { ClientEdit } from "../";
import { ClientTypeId } from "../../lookups";
import { defaultState, reducer } from "./reducer";

const defaultClient: ClientEdit = {
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

describe("client reducer", () => {
    it("should handle CLIENTS_CLIENT_FETCHING", () => {
        const initalState = {
            ...defaultState,
            client: { ...defaultClient },
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            client: null,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_RECEIVE",
            payload: { ...defaultClient },
        });

        const expectedState = {
            ...defaultState,
            client: { ...defaultClient },
            clientOriginal: { ...defaultClient },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "CLIENTS_CLIENT_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
