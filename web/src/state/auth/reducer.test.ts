import { decodeToken } from './helpers';
import { defaultState, reducer } from './reducer';

describe('auth reducer', () => {
    it('should handle AUTH_SIGNIN_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'AUTH_SIGNIN_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle AUTH_SIGNIN_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'AUTH_SIGNIN_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle AUTH_SIGNIN_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const identity = {
            branchId: '1',
            branchName: 'b1',
            email: 'dean@gmail.com',
            firstName: 'Dean',
            lastName: 'van Niekerk',
            organisationId: '2',
            organisationName: 'o2',
            roles: ['admin'],
            scope: 1,
            useCaseIds: ['1'],
            userId: '12345'
        };

        const token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcwMjU4NTllLWU5YTAtNDAzYS0xNTNmLTA4ZDY5YjFkZmVkNCIsIm9yZ2FuaXNhdGlvbklkIjoiOWE0NmM1YWUtM2Y2Zi00OTRjLWIwZGUtZDkwOGYwODUwN2MzIiwiYnJhbmNoSWQiOiJjZmFhN2JmNC1iZmY4LTRjOGMtYjcxZS1mNjRiZDgyNDk3NTAiLCJzY29wZSI6Ik9yZ2FuaXNhdGlvbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJzdXBlcl9hZG1pbmlzdHJhdG9yIiwibWVtX2FkbWluaXN0cmF0b3IiLCJjb21fYWRtaW5pc3RyYXRvciIsImRpcl9hZG1pbmlzdHJhdG9yIl0sImV4cCI6MTU1MzY5MDI1OX0.HRcNZJMzkkx4NHsWlQLHoszPgv1qCtOM_eS1uJEOwEw';

        const actualState = reducer(initalState, {
            type: 'AUTH_SIGNIN_RECEIVE',
            payload: {
                token: token,
                identity: identity
            }
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
            token: token,
            identity: { ...identity },
            tokenData: decodeToken(token)
        };

        expect(actualState).toEqual(expectedState);
    });
});
