import { ImportColumn, ImportData } from './';
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
});
