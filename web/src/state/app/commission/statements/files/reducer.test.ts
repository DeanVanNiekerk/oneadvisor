import { FileInfo } from '@/state/types';

import { defaultState, reducer } from './reducer';

describe("statementFiles list reducer", () => {
    it("should handle STATEMENTS_FILES_LIST_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "STATEMENTS_FILES_LIST_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_FILES_LIST_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_FILES_LIST_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle STATEMENTS_FILES_LIST_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const file: FileInfo = {
            storageName: "n1",
            contentType: "xlsx",
            created: "1999-01-01",
            lastModified: "1999-01-01",
            deleted: false,
            size: 2341,
            url: "http://hi.com",
        };

        const actualState = reducer(initalState, {
            type: "STATEMENTS_FILES_LIST_RECEIVE",
            payload: [file],
        });

        const expectedState = {
            ...defaultState,
            items: [file],
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
