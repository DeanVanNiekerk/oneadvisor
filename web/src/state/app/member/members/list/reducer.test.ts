import { defaultState, reducer } from './reducer';

describe('member list reducer', () => {
    it('should handle MEMBERS_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'MEMBERS_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const member = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            maidenName: '',
            initials: 'DJ',
            preferredName: 'ripper',
            idNumber: '12341234'
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_LIST_RECEIVE',
            payload: {
                totalItems: 1,
                items: [member]
            }
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [member],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
