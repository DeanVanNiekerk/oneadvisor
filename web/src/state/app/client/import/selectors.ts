import { createSelector } from 'reselect';
import { v4 } from 'uuid';

import { formatExcelDate } from '@/app/utils';
import { RootState } from '@/state/rootReducer';

import { ImportTableRow } from './';
import { State } from './reducer';
import { ImportColumn } from './types';

const rootSelector = (state: RootState): State => state.app.client.import;

export const clientImportSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const clientImportTableRowsSelector: (
    state: RootState
) => ImportTableRow[] = createSelector(
    rootSelector,
    root => {
        return root.data.map(d => {
            const record = {
                _id: v4()
            };

            root.selectedColumns.forEach((column, index) => {
                let value = d[index];
                if (column === 'dateOfBirth' || column === 'policyStartDate') {
                    value = formatExcelDate(value);
                }

                record[column] = value;
            });
            return record;
        });
    }
);

export const clientImportSelectedColumnsSelector: (
    state: RootState
) => ImportColumn[] = createSelector(
    rootSelector,
    root => {
        return root.selectedColumns.map(sc => {
            const column = root.columns.find(c => c.id === sc);
            return column ? column : { id: '0', name: 'no match' };
        });
    }
);

export const clientImportProgressPercentSelector: (
    state: RootState
) => number = createSelector(
    rootSelector,
    root => {
        return Math.floor(
            ((root.resultsSuccess.length + root.resultsFailure.length) /
                root.clients.length) *
                100
        );
    }
);
