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
            companyId: '1'
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBERS_NEXT_STEP', () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 1
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP'
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 2
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP', () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 4
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP'
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 3
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBER_SUCCESS', () => {
        const member1 = {
            _id: '1',
            idNumber: '12345'
        };

        const member2 = {
            _id: '2',
            idNumber: '54321'
        };

        const initalState = {
            ...defaultState,
            resultsSuccess: [member1]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBER_SUCCESS',
            payload: member2
        });

        const expectedState = {
            ...defaultState,
            resultsSuccess: [member1, member2]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBER_FAILURE', () => {
        const result1 = {
            importMember: {
                _id: '1',
                idNumber: '12345'
            },
            error: 'error 1'
        };

        const result2 = {
            importMember: {
                _id: '2',
                idNumber: '54321'
            },
            error: 'error 2'
        };

        const initalState = {
            ...defaultState,
            resultsFailure: [result1]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBER_FAILURE',
            payload: result2
        });

        const expectedState = {
            ...defaultState,
            resultsFailure: [result1, result2]
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBER_FAILURE', () => {
        const member1 = {
            _id: '1',
            idNumber: '12345'
        };

        const result1 = {
            importMember: {
                _id: '1',
                idNumber: '12345'
            },
            error: 'error 1'
        };

        const initalState = {
            ...defaultState,
            resultsSuccess: [member1],
            resultsFailure: [result1]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBER_CLEAR_RESULTS'
        });

        const expectedState = {
            ...defaultState,
            resultsSuccess: [],
            resultsFailure: []
        };

        expect(actualState).toEqual(expectedState);
    });

    it('should handle MEMBERS_IMPORT_MEMBERS_UPDATE_POLICY_COMPANIES', () => {
        const initalState = {
            ...defaultState,
            companyId: '2',
            members: [
                {
                    _id: '123456',
                    idNumber: '8210035032082',
                    policyCompanyId: '1'
                }
            ]
        };

        const actualState = reducer(initalState, {
            type: 'MEMBERS_IMPORT_MEMBERS_UPDATE_POLICY_COMPANIES'
        });

        const expectedState = {
            ...defaultState,
            companyId: '2',
            members: [
                {
                    _id: '123456',
                    idNumber: '8210035032082',
                    policyCompanyId: '2'
                }
            ]
        };

        expect(actualState).toEqual(expectedState);
    });
});
