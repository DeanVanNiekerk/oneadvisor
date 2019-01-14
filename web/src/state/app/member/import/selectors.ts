import { createSelector } from 'reselect';
import { v4 } from 'uuid';

import { RootState } from '@/state/rootReducer';

import { ImportTableRow } from './';
import { State } from './reducer';

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

            root.selectedColumns.forEach((value, index) => {
                record[value] = d[index];
            });
            return record;
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
