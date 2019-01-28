import { getValidationResult } from '@/test';

import { MemberPreview } from '../';
import { defaultState, reducer } from './reducer';

const defaultMember: MemberPreview = {
    id: '10',
    firstName: 'Dean',
    lastName: 'Jackson',
    idNumber: '12341234',
    dateOfBirth: '1982-10-03',
    policyCount: 2,
    contactCount: 3
};

describe('member preview reducer', () => {
    it('should handle MEMBERS_MEMBER_PREVIEW_FETCHING', () => {
        const initalState = {
            ...defaultState,
            member: { ...defaultMember }
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_PREVIEW_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            member: null
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_PREVIEW_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_PREVIEW_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_MEMBER_PREVIEW_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_MEMBER_PREVIEW_RECEIVE',
            payload: { ...defaultMember }
        });

        const expectedState = {
            ...defaultState,
            member: { ...defaultMember },
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
