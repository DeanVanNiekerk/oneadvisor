import { decodeToken } from '../helpers';
import { defaultState, reducer } from './reducer';

describe("token reducer", () => {
    it("should handle AUTH_TOKEN_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            token: null,
            tokenData: null,
        };

        const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcwMjU4NTllLWU5YTAtNDAzYS0xNTNmLTA4ZDY5YjFkZmVkNCIsIm9yZ2FuaXNhdGlvbklkIjoiOWE0NmM1YWUtM2Y2Zi00OTRjLWIwZGUtZDkwOGYwODUwN2MzIiwiYnJhbmNoSWQiOiJjZmFhN2JmNC1iZmY4LTRjOGMtYjcxZS1mNjRiZDgyNDk3NTAiLCJzY29wZSI6Ik9yZ2FuaXNhdGlvbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJzdXBlcl9hZG1pbmlzdHJhdG9yIiwibWVtX2FkbWluaXN0cmF0b3IiLCJjb21fYWRtaW5pc3RyYXRvciIsImRpcl9hZG1pbmlzdHJhdG9yIl0sImV4cCI6MTU1MzY5MDI1OX0.HRcNZJMzkkx4NHsWlQLHoszPgv1qCtOM_eS1uJEOwEw";

        const actualState = reducer(initalState, {
            type: "AUTH_TOKEN_RECEIVE",
            payload: token,
        });

        const expectedState = {
            ...defaultState,
            token: token,
            tokenData: decodeToken(token),
        };

        expect(actualState).toEqual(expectedState);
    });
});
