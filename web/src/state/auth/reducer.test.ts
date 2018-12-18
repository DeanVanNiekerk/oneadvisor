import { defaultState, reducer } from './reducer';

describe('auth reducer', () => {
    it('should handle AUTH_RECIEVE_AUTHENTICATION', () => {
        const payload = {
            userInfo: {
                given_name: 'Dean',
                family_name: 'Jonny',
                email: '',
                name: '',
                sub: '1'
            },
            idToken: '1234134',
            accessToken: '431212'
        };

        const actualState = reducer(defaultState, {
            type: 'AUTH_RECIEVE_AUTHENTICATION',
            payload: { ...payload }
        });

        const expectedState = {
            ...defaultState,
            ...payload,
            authenticated: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle AUTH_RECIEVE_AUTHENTICATION_CLEAR', () => {
        const initalState = {
            ...defaultState,
            authenticated: true,
            userInfo: {
                given_name: 'Dean',
                family_name: 'Jonny',
                email: '',
                name: '',
                sub: '1'
            },
            idToken: '1234134',
            accessToken: '431212'
        };

        const actualState = reducer(initalState, {
            type: 'AUTH_RECIEVE_AUTHENTICATION_CLEAR'
        });

        const expectedState = {
            ...defaultState
        };

        expect(actualState).toEqual(expectedState);
    });
});
