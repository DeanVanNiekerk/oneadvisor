import { defaultState, reducer } from './reducer';

const defaultIdentity = {
    id: '10',
    firstName: 'Dean',
    lastName: 'Jackson',
    organisationId: '1234',
    useCaseIds: ['uc_1'],
    roleIds: ['role_1']
};

describe('identity reducer', () => {
    it('should handle IDENTITY_FETCHING', () => {
        const initalState = {
            ...defaultState,
            identity: { ...defaultIdentity }
        };

        const actualState = reducer(initalState, {
            type: 'IDENTITY_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            identity: null
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle IDENTITY_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'IDENTITY_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle IDENTITY_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'IDENTITY_RECEIVE',
            payload: { ...defaultIdentity }
        });

        const expectedState = {
            ...defaultState,
            identity: { ...defaultIdentity },
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
