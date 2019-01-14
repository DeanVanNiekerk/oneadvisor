import { ImportData } from './';
import * as actions from './actions';
import { ImportColumn, ImportMember } from './types';

describe('member: import: actions', () => {
    it('should dispatch MEMBERS_IMPORT_DATA_RECEIVE when receiveMemberImportData is called', () => {
        const data: ImportData = [['val1', 'val2'], ['val3', 'val4']];

        const expectedAction = {
            type: 'MEMBERS_IMPORT_DATA_RECEIVE',
            payload: data
        };

        expect(actions.receiveMemberImportData(data)).toEqual(expectedAction);
    });

    it('should dispatch MEMBERS_IMPORT_COLUMNS_RECEIVE when receiveMemberImportColumns is called', () => {
        const columns: ImportColumn[] = [
            {
                id: 'idNumber',
                name: 'ID Number'
            }
        ];

        const expectedAction = {
            type: 'MEMBERS_IMPORT_COLUMNS_RECEIVE',
            payload: columns
        };

        expect(actions.receiveMemberImportColumns(columns)).toEqual(
            expectedAction
        );
    });

    it('should dispatch MEMBERS_IMPORT_SELECTED_COLUMNS_RECEIVE when receiveMemberImportSelectedColumns is called', () => {
        const columns: string[] = ['idNumber'];

        const expectedAction = {
            type: 'MEMBERS_IMPORT_SELECTED_COLUMNS_RECEIVE',
            payload: columns
        };

        expect(actions.receiveMemberImportSelectedColumns(columns)).toEqual(
            expectedAction
        );
    });

    it('should dispatch MEMBERS_IMPORT_MEMBERS_RECEIVE when receiveMemberImportMembers is called', () => {
        const members: ImportMember[] = [
            {
                _id: '123456',
                idNumber: '8210035032082'
            }
        ];

        const expectedAction = {
            type: 'MEMBERS_IMPORT_MEMBERS_RECEIVE',
            payload: members
        };

        expect(actions.receiveMemberImportMembers(members)).toEqual(
            expectedAction
        );
    });

    it('should dispatch MEMBERS_IMPORT_MEMBERS_REMOVE when removeMemberImportMember is called', () => {
        const expectedAction = {
            type: 'MEMBERS_IMPORT_MEMBERS_REMOVE',
            payload: '123'
        };

        expect(actions.removeMemberImportMember('123')).toEqual(expectedAction);
    });

    it('should dispatch MEMBERS_IMPORT_MEMBERS_RECEIVE when receiveMemberImportMembers is called', () => {
        const expectedAction = {
            type: 'MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE',
            payload: '1'
        };

        expect(actions.receiveMemberImportPolicyCompany('1')).toEqual(
            expectedAction
        );
    });

    it('should dispatch MEMBERS_IMPORT_MEMBERS_NEXT_STEP when memberImportNextStep is called', () => {
        const expectedAction = {
            type: 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP'
        };

        expect(actions.memberImportNextStep()).toEqual(expectedAction);
    });

    it('should dispatch MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP when memberImportPreviousStep is called', () => {
        const expectedAction = {
            type: 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP'
        };

        expect(actions.memberImportPreviousStep()).toEqual(expectedAction);
    });
});
