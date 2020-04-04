import React from "react";
import { connect } from "react-redux";

import { formatCurrency } from "@/app/utils";
import { RootState } from "@/state";
import {
    userCompanyMonthlyCommissionPieDataSelector,
    userCompanyMonthlyCommissionSelector,
    userCompanyMonthlyCommissionTotalAmountExclVatSelector,
} from "@/state/commission/reports";
import { Pie } from "@/ui/controls";

type Props = PropsFromState;

const CompanyChart: React.FC<Props> = (props: Props) => {
    const percent = (value: number) => {
        return (value / props.total) * 100;
    };

    return (
        <Pie
            isLoading={props.fetching}
            data={props.data}
            sliceLabel={(d) => (percent(d.value) > 10 ? formatCurrency(d.value, 0) : "")}
            tooltipFormat={(value) => formatCurrency(value, 0)}
            startAngle={-45}
            radialLabelsSkipAngle={8}
        />
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const userCompanyMonthlyCommissionState = userCompanyMonthlyCommissionSelector(state);

    return {
        companyRecords: userCompanyMonthlyCommissionState.items,
        fetching: userCompanyMonthlyCommissionState.fetching,
        total: userCompanyMonthlyCommissionTotalAmountExclVatSelector(state),
        data: userCompanyMonthlyCommissionPieDataSelector(state),
    };
};

export default connect(mapStateToProps)(CompanyChart);
