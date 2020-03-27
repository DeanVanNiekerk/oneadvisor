import React from "react";
import { connect } from "react-redux";

import { CommissionType, commissionTypesSelector } from "@/state/app/commission/lookups";
import { RootState } from "@/state/rootReducer";

type Props = {
    commissionTypes: CommissionType[];
    commissionTypeId: string;
};

const CommissionTypeNameComponent: React.FC<Props> = (props: Props) => {
    const { commissionTypes, commissionTypeId } = props;

    const commissionType = commissionTypes.find((u) => u.id === commissionTypeId);

    if (!commissionType) return <span />;

    return <span>{commissionType.name}</span>;
};

const mapStateToProps = (state: RootState) => {
    const commissionTypesState = commissionTypesSelector(state);

    return {
        commissionTypes: commissionTypesState.items,
    };
};

const CommissionTypeName = connect(mapStateToProps)(CommissionTypeNameComponent);

export { CommissionTypeName };
