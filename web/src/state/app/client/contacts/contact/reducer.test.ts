import { getValidationResult } from '@/test';

import { defaultState, reducer } from './reducer';

describe('contact reducer', () => {
    it('should handle CONTACTS_CONTACT_FETCHING', () => {
        const initalState = {
            ...defaultState,
            validationResults: [getValidationResult()]
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_CONTACT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_CONTACT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            fetching: true
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_CONTACT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            
            fetching: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_CONTACT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            fetching: true,
            validationResults: [getValidationResult()]
        };

        const contact = {
            id: '10',
            clientId: '12',
            contactTypeId: '14',
            value: '0825728997'
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_CONTACT_RECEIVE',
            payload: { ...contact }
        });

        const expectedState = {
            ...defaultState,
            contact: { ...contact },
            fetching: false,
            validationResults: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_CONTACT_EDIT_FETCHING', () => {
        const actualState = reducer(defaultState, {
            type: 'CONTACTS_CONTACT_EDIT_FETCHING'
        });

        const expectedState = {
            ...defaultState,
            updating: true
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_CONTACT_EDIT_FETCHING_ERROR', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_CONTACT_EDIT_FETCHING_ERROR'
        });

        const expectedState = {
            ...defaultState,
            
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle CONTACTS_CONTACT_EDIT_RECEIVE', () => {
        const initalState = {
            ...defaultState,
            updating: true
        };

        const actualState = reducer(initalState, {
            type: 'CONTACTS_CONTACT_EDIT_RECEIVE'
        });

        const expectedState = {
            ...defaultState,
            updating: false
        };

        expect(actualState).toEqual(expectedState);
    });
});
