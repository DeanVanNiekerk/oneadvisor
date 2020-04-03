import { getValidationResult } from "@/test";

import { ChangeLogEdit } from "../";
import { defaultState, reducer } from "./reducer";

describe("changeLog reducer", () => {
    it("should handle CHANGELOGS_CHANGELOG_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()],
        };

        const changeLog: ChangeLogEdit = {
            id: "10",
            versionNumber: "12",
            releaseDate: "14",
            published: true,
            log: "A log here",
        };

        const actualState = reducer(initalState, {
            type: "CHANGELOGS_CHANGELOG_RECEIVE",
            payload: { ...changeLog },
        });

        const expectedState = {
            ...defaultState,
            changeLog: { ...changeLog },
            validationResults: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CHANGELOGS_CHANGELOG_EDIT_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "CHANGELOGS_CHANGELOG_EDIT_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            updating: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CHANGELOGS_CHANGELOG_EDIT_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "CHANGELOGS_CHANGELOG_EDIT_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,

            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CHANGELOGS_CHANGELOG_EDIT_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            updating: true,
        };

        const actualState = reducer(initalState, {
            type: "CHANGELOGS_CHANGELOG_EDIT_RECEIVE",
        });

        const expectedState = {
            ...defaultState,
            updating: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
