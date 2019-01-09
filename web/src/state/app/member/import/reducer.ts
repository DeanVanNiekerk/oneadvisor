import update from 'immutability-helper';

import { Company } from '../../directory/lookups/companies';
import { ImportMemberAction } from './actions';
import { ImportColumn, ImportData, ImportMember } from './types';

export type State = {
    readonly data: ImportData;
    readonly currentStepIndex: number;
    readonly columns: ImportColumn[];
    readonly members: ImportMember[];
    readonly companyId: string | null;
};

export const defaultState: State = {
    data: [],
    members: [],
    companyId: null,
    currentStepIndex: 0,
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
        case 'MEMBERS_IMPORT_MEMBERS_RECEIVE': {
            return {
                ...state,
                members: [...action.payload]
            };
        }
        case 'MEMBERS_IMPORT_MEMBERS_REMOVE': {
            const members = state.members;
            const index = members.findIndex(m => m._id === action.payload);

            if (index == -1) return state;

            return {
                ...state,
                members: update(members, { $splice: [[index, 1]] })
            };
        }
        case 'MEMBERS_IMPORT_MEMBERS_POLICY_COMPANY_RECEIVE': {
            return {
                ...state,
                companyId: action.payload
            };
        }
        case 'MEMBERS_IMPORT_MEMBERS_NEXT_STEP': {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex + 1
            };
        }
        case 'MEMBERS_IMPORT_MEMBERS_PREVIOUS_STEP': {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex - 1
            };
        }
        default:
            return state;
    }
};
