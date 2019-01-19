import { UserSimple } from '../';
import { defaultState, reducer } from './reducer';

describe('user list reducer', () => {
    it('should handle USERSSIMPLE_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'USERSSIMPLE_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERSSIMPLE_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USERSSIMPLE_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USERSSIMPLE_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const user: UserSimple = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            fullName: 'DJ'
        };

        const actualState = reducer(initalState, {
            type: 'USERSSIMPLE_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [user]
            }
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [user],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
