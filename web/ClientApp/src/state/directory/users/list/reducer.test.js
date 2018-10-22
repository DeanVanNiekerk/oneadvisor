import { reducer, defaultState } from './reducer';
import * as types from './actions'

describe('user list reducer', () => {

    it('should return the default state', () => {
        expect(reducer(undefined, {})).toEqual(defaultState);
    })

    it('should handle USERS_LIST_FETCHING', () => {

        const actualState = reducer(defaultState, {
            type: types.USERS_LIST_FETCHING
        })

        const expectedState = {
            ...defaultState,
            fetching: true
        }

        expect(actualState).toEqual(expectedState)
    })

    it('should handle USERS_LIST_FETCHING_ERROR', () => {

        const initalState = {
            ...defaultState,
            fetching: true
        }

        const actualState = reducer(initalState, {
            type: types.USERS_LIST_FETCHING_ERROR
        })

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        }

        expect(actualState).toEqual(expectedState)
    })


    it('should handle USERS_LIST_RECEIVE', () => {

        const initalState = {
            ...defaultState,
            fetching: true
        }

        const actualState = reducer(initalState, {
            type: types.USERS_LIST_RECEIVE,
            payload: [
                { name: 'Indie' },
                { name: 'Jones' }
            ]
        })

        const expectedState = {
            ...defaultState,
            items: [
                { name: 'Indie' },
                { name: 'Jones' }
            ],
            fetching: false
        }

        expect(actualState).toEqual(expectedState)
    })


})