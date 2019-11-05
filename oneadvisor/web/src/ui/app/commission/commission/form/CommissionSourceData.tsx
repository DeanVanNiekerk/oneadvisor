import React from "react";
import { connect } from "react-redux";

import { commissionSelector } from "@/state/app/commission/commissions";
import { RootState } from "@/state/rootReducer";
import { FormReadOnly } from "@/ui/controls";

type Props = PropsFromState;

const CommissionSourceData: React.FC<Props> = ({ commission }) => {
    if (!commission || !commission.sourceData) return <span>No Source Data</span>;

    return <FormReadOnly data={commission.sourceData} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const commissionState = commissionSelector(state);
    return {
        commission: commissionState.commission,
    };
};

export default connect(mapStateToProps)(CommissionSourceData);
