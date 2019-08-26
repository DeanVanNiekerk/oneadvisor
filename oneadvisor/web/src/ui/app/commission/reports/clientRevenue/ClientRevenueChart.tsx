import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { Filters } from "@/app/table";
import { formatCurrency } from "@/app/utils";
import {
    clientRevenueBandsDataSelector, clientRevenueSelector, fetchClientRevenueData
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { Bar } from "@/ui/controls";
import { BarDatum } from "@nivo/bar";

type Props = {
    records: BarDatum[];
    filters: Filters;
    fetching: boolean;
} & DispatchProp;

class ClientRevenueChart extends Component<Props> {

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.filters != this.props.filters) this.loadData();
    }

    loadData = () => {
        this.props.dispatch(fetchClientRevenueData(this.props.filters));
    };

    render() {
        return (
            <Bar
                data={this.props.records}
                keys={["Monthly as and when"]}
                isLoading={this.props.fetching}
                labelFormat={value => formatCurrency(value, 0)}
                tooltipFormat={value => formatCurrency(value, 0)}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const clientRevenueState = clientRevenueSelector(state);

    return {
        records: clientRevenueBandsDataSelector(state),
        fetching: clientRevenueState.fetching,
        filters: clientRevenueState.filters,
    };
};

export default connect(mapStateToProps)(ClientRevenueChart);
