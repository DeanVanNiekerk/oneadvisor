import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { PageOptions, SortOptions } from "@/app/table";
import {
    CommissionLapseDataFilters, commissionLapseSelector, fetchCommissionLapseData
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { Header } from "@/ui/controls";

import CommissionLapseTable from "./CommissionLapseTable";

type Props = {
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    filters: CommissionLapseDataFilters;
} & DispatchProp;

class CommissionLapseReport extends Component<Props> {

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadData();
    }

    loadData = () => {
        this.props.dispatch(
            fetchCommissionLapseData(this.props.pageOptions, this.props.sortOptions, this.props.filters)
        );
    };

    render() {
        return (
            <>
                <Header
                    icon="alert"
                >
                    Commission Lapse Report
                </Header>

                <CommissionLapseTable />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionLapseState = commissionLapseSelector(state);

    return {
        pageOptions: commissionLapseState.pageOptions,
        sortOptions: commissionLapseState.sortOptions,
        filters: commissionLapseState.filters,
    };
};

export default connect(mapStateToProps)(CommissionLapseReport);
