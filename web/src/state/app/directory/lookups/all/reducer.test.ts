import { defaultState, reducer } from './reducer';

describe('lookups reducer', () => {
    it('should handle LOOKUPS_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'LOOKUPS_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle LOOKUPS_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'LOOKUPS_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle LOOKUPS_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'LOOKUPS_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
