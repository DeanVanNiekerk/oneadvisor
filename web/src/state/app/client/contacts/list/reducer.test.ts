import { defaultState, reducer } from './reducer';

describe('contact list reducer', () => {
    it('should handle CONTACTS_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'CONTACTS_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const contact = {
            id: '10',
            clientId: '12',
            contactTypeId: '14',
            value: '0825728997'
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_LIST_RECEIVE',
            payload: {
                items: [contact],
                totalItems: 1
            }
        });

        const expectedState = {
            ...defaultState,
            totalItems: 1,
            items: [contact],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
