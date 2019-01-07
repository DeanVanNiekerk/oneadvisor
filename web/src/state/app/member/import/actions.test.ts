import { ImportData } from './';
import * as actions from './actions';
import { ImportColumn } from './types';

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
});
