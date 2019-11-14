import React from "react";
import { connect } from "react-redux";

import {
    CommissionEarningsType,
    commissionEarningsTypesSelector,
    getCommissionEarningsTypeName,
} from "@/state/app/commission/lookups";
import { RootState } from "@/state/rootReducer";

type Props = {
    commissionEarningsTypes: CommissionEarningsType[];
    commissionEarningsTypeId: string;
};

const CommissionEarningsTypeNameComponent: React.FC<Props> = (props: Props) => {
    const { commissionEarningsTypes, commissionEarningsTypeId } = props;

    const name = getCommissionEarningsTypeName(commissionEarningsTypeId, commissionEarningsTypes);

    return <span>{name}</span>;
};

const mapStateToProps = (state: RootState) => {
    const typesState = commissionEarningsTypesSelector(state);

    return {
        commissionEarningsTypes: typesState.items,
    };
};

const CommissionEarningsTypeName = connect(mapStateToProps)(CommissionEarningsTypeNameComponent);

export { CommissionEarningsTypeName };
