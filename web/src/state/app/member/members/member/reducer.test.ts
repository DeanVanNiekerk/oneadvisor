import { getValidationResult } from '@/test';

import { defaultState, reducer } from './reducer';

const defaultMember = {
    id: '10',
    firstName: 'Dean',
    lastName: 'Jackson',
    maidenName: '',
    initials: 'DJ',
    preferredName: 'ripper',
    idNumber: '12341234',
    dateOfBirth: '1982-10-03'
};

describe('member reducer', () => {
    it('should handle MEMBERS_MEMBER_FETCHING', () => {
        const initalState = {
            ...defaultState,
            member: { ...defaultMember },
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            member: null,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_RECEIVE',
            payload: { ...defaultMember }
        });

        const expectedState = {
            ...defaultState,
            member: { ...defaultMember },
            fetching: false,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'MEMBERS_MEMBER_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
