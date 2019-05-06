import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.commission.reports.userEarningsTypeMonthlyCommission;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const userEarningsTypeMonthlyCommissionTotalSelector: (
    state: RootState
) => number = createSelector(
    rootSelector,
    root => {
        return root.items.reduce((p, c) => {
            return p + c.amountIncludingVAT;
        }, 0);
    }
);
