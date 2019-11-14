import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { formatCurrency } from "@/app/utils";
import {
    commissionProjectionsSelector,
    projectionPolicyTypeChartCurrentLabelSelector,
    projectionPolicyTypeChartDataSelector,
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { Bar } from "@/ui/controls";
import { BarDatum } from "@nivo/bar";

type Props = {
    records: BarDatum[];
    fetching: boolean;
    currentLabel: string;
} & DispatchProp;

class TotalsBarChart extends Component<Props> {
    render() {
        return (
            <Bar
                data={this.props.records}
                keys={["value"]}
                isLoading={this.props.fetching}
                labelFormat={value => formatCurrency(value, 0)}
                isInteractive={false}
                defs={[
                    {
                        id: "currentMonth",
                        type: "patternLines",
                        background: "#bebada",
                        color: "#bebada",
                    },
                ]}
                fill={[
                    {
                        match: d => d.key === this.props.currentLabel,
                        id: "currentMonth",
                    },
                ]}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const projectionsState = commissionProjectionsSelector(state);

    return {
        records: projectionPolicyTypeChartDataSelector(state),
        fetching: projectionsState.fetching,
        currentLabel: projectionPolicyTypeChartCurrentLabelSelector(state),
    };
};

export default connect(mapStateToProps)(TotalsBarChart);
