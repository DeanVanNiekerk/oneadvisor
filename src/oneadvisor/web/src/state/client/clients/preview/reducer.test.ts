import { ClientPreview } from "../";
import { ClientTypeId } from "../../lookups";
import { defaultState, reducer } from "./reducer";

const defaultClient: ClientPreview = {
    id: "10",
    clientTypeId: ClientTypeId.Individual,
    firstName: "Dean",
    lastName: "Jackson",
    idNumber: "12341234",
    alternateIdNumber: "987987",
    dateOfBirth: "1982-10-03",
    policyCount: 2,
    contactCount: 3,
};

describe("client preview reducer", () => {
    it("should handle CLIENTS_CLIENT_PREVIEW_FETCHING", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_PREVIEW_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_PREVIEW_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_PREVIEW_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_CLIENT_PREVIEW_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_CLIENT_PREVIEW_RECEIVE",
            payload: { ...defaultClient },
        });

        const expectedState = {
            ...defaultState,
            client: { ...defaultClient },
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
