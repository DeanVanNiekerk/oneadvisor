import { defaultState, reducer } from './reducer';

describe('usecase list reducer', () => {
    it('should handle USECASES_LIST_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'USECASES_LIST_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USECASES_LIST_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'USECASES_LIST_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle USECASES_LIST_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const usecase = {
            id: '10',
            name: 'UseCase1',
            usecaseId: 'app_1'
        };

        const actualState = reducer(initalState, {
            type: 'USECASES_LIST_RECEIVE',
            payload: [usecase]
        });

        const expectedState = {
            ...defaultState,
            items: [usecase],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
