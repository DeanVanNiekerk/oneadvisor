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

            root.columns.forEach((value, index) => {
                record[value.id] = d[index];
            });
            return record;
        });
    }
);
