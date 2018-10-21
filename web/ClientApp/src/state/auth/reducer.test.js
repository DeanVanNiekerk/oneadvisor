import reducer, { defaultState } from './reducer';
import * as types from './actions'

describe('auth reducer', () => {

    it('should return the default state', () => {
        expect(reducer(undefined, {})).toEqual(defaultState);
    })

    it('should handle AUTH_RECIEVE_AUTHENTICATION', () => {

        const payload = {
            userInfo: { firstName: 'Dean' },
            idToken: '1234134',
            accessToken: '431212',
        }

        const actualState = reducer(defaultState, {
            type: types.AUTH_RECIEVE_AUTHENTICATION,
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
            userInfo: { firstName: 'Dean' },
            idToken: '1234134',
            accessToken: '431212'
        }

        const actualState = reducer(initalState, {
            type: types.AUTH_RECIEVE_AUTHENTICATION_CLEAR
        })

        const expectedState = {
            ...defaultState,
        }

        expect(actualState).toEqual(expectedState)
    })

})