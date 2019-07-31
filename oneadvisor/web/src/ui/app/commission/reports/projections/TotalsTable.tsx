import { ColumnProps } from "antd/lib/table";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import {
    commissionProjectionsSelector, projectionTotalsTableColumnsSelector, projectionTotalsTableRowsSelector
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { getTable } from "@/ui/controls";

const Table = getTable();

type Props = {
    fetching: boolean;
    columnDefinitions: ColumnProps<any>[];
    rows: object[];
} & DispatchProp;

class TotalsTable extends Component<Props> {
    render() {
        return (
            <Table
                rowKey="earningsType"
                columns={this.props.columnDefinitions}
                dataSource={this.props.rows}
                loading={this.props.fetching}
                hidePagination={true}
                scroll={{
                    x: true,
                }}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const projectionsState = commissionProjectionsSelector(state);

    return {
        fetching: projectionsState.fetching,
        columnDefinitions: projectionTotalsTableColumnsSelector(state),
        rows: projectionTotalsTableRowsSelector(state),
    };
};

export default connect(mapStateToProps)(TotalsTable);
