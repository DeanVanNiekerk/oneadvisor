import React, { Component } from 'react';
import { connect } from 'react-redux';

import { formatCurrency } from '@/app/utils';
import {
    CommissionEarningsType, commissionEarningsTypesSelector, getCommissionEarningsTypeName
} from '@/state/app/commission/lookups';
import { UserEarningsTypeMonthlyCommissionData } from '@/state/app/commission/reports';
import { RootState } from '@/state/rootReducer';
import { Pie } from '@/ui/controls';
import { PieDatum } from '@nivo/pie';

type Props = {
    earningsTypeRecords: UserEarningsTypeMonthlyCommissionData[];
    fetching: boolean;
    earningsTypeTotal: number;
    commissionEarningsTypes: CommissionEarningsType[];
};

class EarningsTypeChart extends Component<Props> {

    data = (): PieDatum[] => {
        return this.props.earningsTypeRecords
            .filter(r => r.amountExcludingVAT > 0)
            .map(r => {
                return {
                    id: r.commissionEarningsTypeId,
                    label: getCommissionEarningsTypeName(r.commissionEarningsTypeId, this.props.commissionEarningsTypes),
                    value: r.amountExcludingVAT,
                }
            })
    }

    render() {

        return (
            <Pie
                data={this.data()}
                sliceLabel={(d) => formatCurrency(d.value)}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const typesState = commissionEarningsTypesSelector(state);

    return {
        commissionEarningsTypes: typesState.items,
    };
};

export default connect(mapStateToProps)(EarningsTypeChart);
