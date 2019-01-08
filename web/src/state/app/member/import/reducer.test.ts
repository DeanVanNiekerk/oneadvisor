import { Company } from '../../directory/lookups/companies';
import { ImportColumn, ImportData, ImportMember } from './';
import { defaultState, reducer } from './reducer';

describe('member import reducer', () => {
    it('should handle MEMBERS_IMPORT_DATA_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const data: ImportData = [['val1', 'val2'], ['val3', 'val4']];

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_DATA_RECEIVE',
            payload: data
        });

        const expectedState = {
            ...defaultState,
            data: [...data]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_COLUMNS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const columns: ImportColumn[] = [
            {
                id: 'idNumber',
                name: 'ID Number'
            }
        ];

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_COLUMNS_RECEIVE',
            payload: columns
        });

        const expectedState = {
            ...defaultState,
            columns: [...columns]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBERS_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const members: ImportMember[] = [
            {
                _id: '123456',
                idNumber: '8210035032082'
            }
        ];

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_RECEIVE',
            payload: members
        });

        const expectedState = {
            ...defaultState,
            members: [...members]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBERS_REMOVE', () => {
        const initalState = {
            ...defaultState,
            members: [
                {
                    _id: '1',
                    idNumber: '100'
                },
                {
                    _id: '2',
                    idNumber: '200'
                },
                {
                    _id: '3',
                    idNumber: '300'
                }
            ]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_REMOVE',
            payload: '2'
        });

        const expectedState = {
            ...defaultState,
            members: [
                {
                    _id: '1',
                    idNumber: '100'
                },
                {
                    _id: '3',
                    idNumber: '300'
                }
            ]
        };

        expect(actualState).toEqual(expectedState);
    });

    fit('should handle MEMBERS_IMPORT_MEMBERS_REMOVE, invalid id', () => {
        const initalState = {
            ...defaultState,
            members: [
                {
                    _id: '1',
                    idNumber: '100'
                },
                {
                    _id: '2',
                    idNumber: '200'
                }
            ]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_REMOVE',
            payload: '3'
        });

        const expectedState = {
            ...defaultState,
            members: [
                {
                    _id: '1',
                    idNumber: '100'
                },
                {
                    _id: '2',
                    idNumber: '200'
                }
            ]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE', () => {
        const initalState = {
            ...defaultState
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE',
            payload: '1'
        });

        const expectedState = {
            ...defaultState,
            company: '1'
        };

        expect(actualState).toEqual(expectedState);
    });
});
