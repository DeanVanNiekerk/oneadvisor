// @flow

import { reducer, defaultState } from './reducer';
import * as types from './actions'

describe('user list reducer', () => {

    it('should handle USERS_LIST_FETCHING', () => {

        const actualState = reducer(defaultState, {
            type: "USERS_LIST_FETCHING"
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
            type: "USERS_LIST_FETCHING_ERROR"
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
            type: "USERS_LIST_RECEIVE",
            payload: [
                { id: '123', firstName: 'Indie', lastName: 'Jones' }
            ]
        })

        const expectedState = {
            ...defaultState,
            items: [
                { id: '123', firstName: 'Indie', lastName: 'Jones' }
            ],
            fetching: false
        }

        expect(actualState).toEqual(expectedState)
    })


})