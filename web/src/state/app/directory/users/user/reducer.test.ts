import { getValidationResult } from '@/test';

import { UserEdit } from '../';
import { defaultState, reducer } from './reducer';

const defaultUser: UserEdit = {
    id: "10",
    firstName: "Dean",
    lastName: "Jackson",
    email: "dean@gmail.com",
    userName: "dean",
    branchId: "12341234",
    roles: ["role_1"],
    scope: 1,
    aliases: ["DJ"],
};

describe("user reducer", () => {
    it("should handle USERS_USER_FETCHING", () => {
        const initalState = {
            ...defaultState,
            user: { ...defaultUser },
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "USERS_USER_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            user: null,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle USERS_USER_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "USERS_USER_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle USERS_USER_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()],
        };

        const actualState = reducer(initalState, {
            type: "USERS_USER_RECEIVE",
            payload: { ...defaultUser },
        });

        const expectedState = {
            ...defaultState,
            user: { ...defaultUser },
            fetching: false,
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle USERS_USER_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "USERS_USER_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle USERS_USER_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "USERS_USER_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle USERS_USER_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "USERS_USER_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
