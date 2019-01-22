import { createSelector } from 'reselect';
import { v4 } from 'uuid';

import { formatExcelDate } from '@/app/parsers';
import { RootState } from '@/state/rootReducer';

import { ImportTableRow } from './';
import { State } from './reducer';
import { ImportColumn } from './types';

const rootSelector = (state: RootState): State => state.app.member.import;

export const memberImportSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const memberImportTableRowsSelector: (
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
                if (column === 'dateOfBirth') {
                    value = formatExcelDate(value);
                }

                record[column] = value;
            });
            return record;
        });
    }
);

export const memberImportSelectedColumnsSelector: (
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

export const memberImportProgressPercentSelector: (
    state: RootState
) => number = createSelector(
    rootSelector,
    root => {
        return Math.floor(
            ((root.resultsSuccess.length + root.resultsFailure.length) /
                root.members.length) *
                100
        );
    }
);
