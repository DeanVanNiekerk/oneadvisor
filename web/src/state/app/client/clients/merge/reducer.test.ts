import { ClientTypeId } from '@/state/app/directory/lookups/clientTypes';

import { Client } from '../';
import { defaultState, reducer } from './reducer';

const defaultClient: Client = {
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

describe("client merge reducer", () => {
    it("should handle CLIENTS_MERGE_SOURCE_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "CLIENTS_MERGE_SOURCE_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_MERGE_SOURCE_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_MERGE_SOURCE_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_MERGE_SOURCE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_MERGE_SOURCE_RECEIVE",
            payload: {
                totalItems: 1,
                items: [defaultClient],
            },
        });

        const expectedState = {
            ...defaultState,
            clients: [defaultClient],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_MERGE_NEXT_STEP", () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 1,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_MERGE_NEXT_STEP",
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 2,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_MERGE_PREVIOUS_STEP", () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 4,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_MERGE_PREVIOUS_STEP",
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 3,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_MERGE_RESET", () => {
        const initalState = {
            ...defaultState,
            clients: [defaultClient],
            currentStepIndex: 1,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_MERGE_RESET",
        });

        const expectedState = {
            ...defaultState,
            clients: [],
            currentStepIndex: 0,
        };

        expect(actualState).toEqual(expectedState);
    });
});
