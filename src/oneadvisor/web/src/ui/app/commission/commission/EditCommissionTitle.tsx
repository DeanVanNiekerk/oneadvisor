import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { commissionSelector } from "@/state/commission/commissions";

type Props = PropsFromState;

const EditCommissionTitle: React.FC<Props> = ({ commission }) => {
    return <>{commission && commission.id ? `Update Commission` : "New Commission"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({
    commission: commissionSelector(state).commission,
});

export default connect(mapStateToProps)(EditCommissionTitle);
