import { Member } from '../';
import { defaultState, reducer } from './reducer';

const defaultMember: Member = {
    id: "10",
    firstName: "Dean",
    lastName: "Jackson",
    maidenName: "",
    initials: "DJ",
    preferredName: "ripper",
    idNumber: "12341234",
    passportNumber: "987987",
    dateOfBirth: "1982-10-03",
    marriageDate: "1982-10-02",
    marritalStatusId: "987654",
    taxNumber: "AABB1212",
};

describe("member merge reducer", () => {
    it("should handle MEMBERS_MERGE_SOURCE_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "MEMBERS_MERGE_SOURCE_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle MEMBERS_MERGE_SOURCE_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "MEMBERS_MERGE_SOURCE_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle MEMBERS_MERGE_SOURCE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "MEMBERS_MERGE_SOURCE_RECEIVE",
            payload: {
                totalItems: 1,
                items: [defaultMember],
            },
        });

        const expectedState = {
            ...defaultState,
            members: [defaultMember],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle MEMBERS_MERGE_NEXT_STEP", () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 1,
        };

        const actualState = reducer(initalState, {
            type: "MEMBERS_MERGE_NEXT_STEP",
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 2,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle MEMBERS_MERGE_PREVIOUS_STEP", () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 4,
        };

        const actualState = reducer(initalState, {
            type: "MEMBERS_MERGE_PREVIOUS_STEP",
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 3,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle MEMBERS_MERGE_RESET", () => {
        const initalState = {
            ...defaultState,
            members: [defaultMember],
            currentStepIndex: 1,
        };

        const actualState = reducer(initalState, {
            type: "MEMBERS_MERGE_RESET",
        });

        const expectedState = {
            ...defaultState,
            members: [],
            currentStepIndex: 0,
        };

        expect(actualState).toEqual(expectedState);
    });
});
