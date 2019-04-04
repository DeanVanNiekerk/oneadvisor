import { defaultState, reducer } from './reducer';

describe('contactType list reducer', () => {
    it('should handle CONTACTTYPES_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const contactType = {
            id: '10',
            name: 'Type'
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTTYPES_LIST_RECEIVE',
            payload: [contactType]
        });

        const expectedState = {
            ...defaultState,
            items: [contactType]
        };

        expect(actualState).toEqual(expectedState);
    });
});
