import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CommissionEarningsType, commissionEarningsTypesSelector } from '@/state/app/commission/lookups';
import { RootState } from '@/state/rootReducer';

type Props = {
    commissionEarningsTypes: CommissionEarningsType[];
    commissionEarningsTypeId: string;
};

class CommissionEarningsTypeNameComponent extends Component<Props> {
    render() {
        const {
            commissionEarningsTypes,
            commissionEarningsTypeId,
        } = this.props;

        const type = commissionEarningsTypes.find(
            u => u.id === commissionEarningsTypeId
        );

        if (!type) return <span />;

        return <span>{type.name}</span>;
    }
}

const mapStateToProps = (state: RootState) => {
    const typesState = commissionEarningsTypesSelector(state);

    return {
        commissionEarningsTypes: typesState.items,
    };
};

const CommissionEarningsTypeName = connect(mapStateToProps)(
    CommissionEarningsTypeNameComponent
);

export { CommissionEarningsTypeName };
