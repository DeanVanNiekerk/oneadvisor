import { Member } from '../';
import { defaultState, reducer } from './reducer';

describe('member search reducer', () => {
    it('should handle MEMBERS_SEARCH_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'MEMBERS_SEARCH_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_SEARCH_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_SEARCH_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            error: true,
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_SEARCH_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const member: Member = {
            id: '10',
            firstName: 'Dean',
            lastName: 'Jackson',
            maidenName: '',
            initials: 'DJ',
            preferredName: 'ripper',
            idNumber: '12341234',
            passportNumber: '987987',
            dateOfBirth: '1982-10-03',
            marriageDate: '1982-10-02',
            marritalStatusId: '987654',
            taxNumber: 'AABB1212'
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_SEARCH_RECEIVE',
            payload: {
                totalItems: 1,
                items: [member]
            }
        });

        const expectedState = {
            ...defaultState,
            items: [member],
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });
});