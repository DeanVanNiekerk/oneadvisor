import update from 'immutability-helper';

import { ImportCommissionAction } from './actions';
import { ImportColumn, ImportCommission, ImportData, ResultFailure } from './types';

export type State = {
    readonly data: ImportData;
    readonly currentStepIndex: number;
    readonly columns: ImportColumn[];
    readonly selectedColumns: string[];
    readonly commissions: ImportCommission[];
    readonly date: string | null;
    readonly resultsSuccess: ImportCommission[];
    readonly resultsFailure: ResultFailure[];
};

export const defaultState: State = {
    data: [],
    commissions: [],
    resultsSuccess: [],
    resultsFailure: [],
    date: null,
    currentStepIndex: 0,
    selectedColumns: [
        'policyNumber',
        'amountIncludingVAT',
        'vat',
        'commissionTypeCode'
    ],
    columns: [
        {
            id: 'policyNumber',
            name: 'Policy Number'
        },
        {
            id: 'amountIncludingVAT',
            name: 'Amount (Incl VAT)'
        },
        {
            id: 'vat',
            name: 'VAT'
        },
        {
            id: 'commissionTypeCode',
            name: 'Commission Type Code'
        }
    ]
};

export const reducer = (
    state: State = defaultState,
    action: ImportCommissionAction
): State => {
    switch (action.type) {
        case 'COMMISSIONS_IMPORT_DATA_RECEIVE': {
            return {
                ...state,
                data: action.payload
            };
        }
        case 'COMMISSIONS_IMPORT_COLUMNS_RECEIVE': {
            return {
                ...state,
                columns: [...action.payload]
            };
        }
        case 'COMMISSIONS_IMPORT_SELECTED_COLUMNS_RECEIVE': {
            return {
                ...state,
                selectedColumns: [...action.payload]
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSIONS_RECEIVE': {
            return {
                ...state,
                commissions: [...action.payload]
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSIONS_REMOVE': {
            const commissions = state.commissions;
            const index = commissions.findIndex(m => m._id === action.payload);

            if (index == -1) return state;

            return {
                ...state,
                commissions: update(commissions, { $splice: [[index, 1]] })
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSIONS_DATE_RECEIVE': {
            return {
                ...state,
                date: action.payload
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSIONS_UPDATE_DATE': {
            return {
                ...state,
                commissions: state.commissions.map(commission => {
                    return {
                        ...commission,
                        date: state.date ? state.date : ''
                    };
                })
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSIONS_NEXT_STEP': {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex + 1
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSIONS_PREVIOUS_STEP': {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex - 1
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSION_SUCCESS': {
            return {
                ...state,
                resultsSuccess: update(state.resultsSuccess, {
                    $push: [action.payload]
                })
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSION_FAILURE': {
            return {
                ...state,
                resultsFailure: update(state.resultsFailure, {
                    $push: [action.payload]
                })
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSION_CLEAR_RESULTS': {
            return {
                ...state,
                resultsSuccess: [],
                resultsFailure: []
            };
        }
        case 'COMMISSIONS_IMPORT_COMMISSION_RESET': {
            return {
                ...state,
                data: [],
                commissions: [],
                resultsSuccess: [],
                resultsFailure: [],
                date: null,
                currentStepIndex: 0
            };
        }
        default:
            return state;
    }
};
