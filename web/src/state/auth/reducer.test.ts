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

        const actualState = reducer(initalState, {
            type: 'AUTH_SIGNIN_RECEIVE',
            payload: {
                token: '12323',
                identity: identity
            }
        });

        const expectedState = {
            ...defaultState,
            fetching: false,
            token: '12323',
            identity: { ...identity }
        };

        expect(actualState).toEqual(expectedState);
    });
});
