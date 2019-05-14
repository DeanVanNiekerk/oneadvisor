import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { commissionEarningsTypesSelector, UNKNOWN_COMMISSION_EARNINGS_TYPE_ID } from '../../lookups';
import { State } from './reducer';
import { UserEarningsTypeMonthlyCommissionData } from './types';

const rootSelector = (state: RootState): State =>
    state.app.commission.reports.userEarningsTypeMonthlyCommission;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    root => root
);

export const userEarningsTypeMonthlyCommissionItemsSelector: (
    state: RootState
) => UserEarningsTypeMonthlyCommissionData[] = createSelector(
    rootSelector,
    commissionEarningsTypesSelector,
    (root, commissionEarningsTypes) => {
        let types = commissionEarningsTypes.items.map(earningsType => {
            const record = root.items.find(
                r => r.commissionEarningsTypeId === earningsType.id
            );
            if (record) return record;

            return {
                userId: "",
                userLastName: "",
                userFirstName: "",
                month: 0,
                year: 0,
                commissionEarningsTypeId: earningsType.id,
                amountExcludingVAT: 0,
            };
        });

        //Filter out unknown earnings type if it has no value
        types = types.filter(t => {
            if (
                t.commissionEarningsTypeId ===
                    UNKNOWN_COMMISSION_EARNINGS_TYPE_ID &&
                t.amountExcludingVAT === 0
            )
                return false;
            return true;
        });

        return types;
    }
);

export const userEarningsTypeMonthlyCommissionTotalSelector: (
    state: RootState
) => number = createSelector(
    rootSelector,
    root => {
        return root.items.reduce((p, c) => {
            return p + c.amountExcludingVAT;
        }, 0);
    }
);
