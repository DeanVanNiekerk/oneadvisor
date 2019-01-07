import { ImportMemberAction } from './actions';
import { ImportColumn, ImportData } from './types';

export type State = {
    readonly data: ImportData;
    readonly columns: ImportColumn[];
};

export const defaultState: State = {
    data: [],
    columns: [
        {
            id: 'idNumber',
            name: 'ID Number'
        },
        {
            id: 'lastName',
            name: 'Last Name'
        },
        {
            id: 'policyNumber',
            name: 'Policy Number'
        }
    ]
};

export const reducer = (
    state: State = defaultState,
    action: ImportMemberAction
): State => {
    switch (action.type) {
        case 'MEMBERS_IMPORT_DATA_RECEIVE': {
            return {
                ...state,
                data: action.payload
            };
        }
        case 'MEMBERS_IMPORT_COLUMNS_RECEIVE': {
            return {
                ...state,
                columns: [...action.payload]
            };
        }
        default:
            return state;
    }
};
