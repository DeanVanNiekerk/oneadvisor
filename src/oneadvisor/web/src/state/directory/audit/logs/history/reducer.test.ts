import { AuditLog } from "../";
import { defaultState, reducer } from "./reducer";

describe("auditLog history reducer", () => {
    it("should handle AUDIT_LOGS_HISTORY_FETCHING", () => {
        const actualState = reducer(defaultState, {
            type: "AUDIT_LOGS_HISTORY_FETCHING",
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle AUDIT_LOGS_HISTORY_FETCHING_ERROR", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const actualState = reducer(initalState, {
            type: "AUDIT_LOGS_HISTORY_FETCHING_ERROR",
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle AUDIT_LOGS_HISTORY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            fetching: true,
        };

        const auditLog: AuditLog = {
            id: "2345",
            data: { id: "123" },
            entity: "Client",
            entityId: "321321",
            action: "Insert",
            date: "1982-01-01",
            userId: "432234",
        };

        const actualState = reducer(initalState, {
            type: "AUDIT_LOGS_HISTORY_RECEIVE",
            payload: {
                limit: 1,
                items: [auditLog],
                limitReached: false,
            },
        });

        const expectedState = {
            ...defaultState,
            items: [auditLog],
            limitReached: false,
            fetching: false,
        };

        expect(actualState).toEqual(expectedState);
    });
});
