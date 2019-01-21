import { defaultState, reducer } from './reducer';

describe('commissionType list reducer', () => {
    it('should handle COMMISSIONTYPES_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'COMMISSIONTYPES_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONTYPES_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONTYPES_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle COMMISSIONTYPES_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const commissionType = {
            id: '10',
            name: 'Org1'
        };

        const actualState = reducer(initalState, {
            type: 'COMMISSIONTYPES_LIST_RECEIVE',
            payload: [commissionType]
        });

        const expectedState = {
            ...defaultState,
            items: [commissionType],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
