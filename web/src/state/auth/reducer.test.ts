import { reducer, defaultState } from './reducer';

describe('auth reducer', () => {

    it('should handle AUTH_RECIEVE_AUTHENTICATION', () => {

        const payload = {
            userInfo: { firstName: 'Dean', lastName: 'Jonny' },
            idToken: '1234134',
            accessToken: '431212',
        }

        const actualState = reducer(defaultState, {
            type: "AUTH_RECIEVE_AUTHENTICATION",
            payload: { ...payload }
        })

        const expectedState = {
            ...defaultState,
            ...payload,
            authenticated: true,
        }

        expect(actualState).toEqual(expectedState)
    })

    it('should handle AUTH_RECIEVE_AUTHENTICATION_CLEAR', () => {

        const initalState = {
            ...defaultState,
            authenticated: true,
            userInfo: { firstName: 'Dean', lastName: 'Jonny' },
            idToken: '1234134',
            accessToken: '431212'
        }

        const actualState = reducer(initalState, {
            type: "AUTH_RECIEVE_AUTHENTICATION_CLEAR"
        })

        const expectedState = {
            ...defaultState,
        }

        expect(actualState).toEqual(expectedState)
    })

})