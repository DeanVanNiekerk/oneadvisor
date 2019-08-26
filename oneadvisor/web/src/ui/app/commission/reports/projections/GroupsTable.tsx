import { ColumnProps } from "antd/lib/table";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import {
    commissionProjectionsSelector, projectionGroupsTableColumnsSelector, projectionGroupTableRowsSelector
} from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { getTable } from "@/ui/controls";

const Table = getTable();

type Props = {
    fetching: boolean;
    columnDefinitions: ColumnProps<any>[];
    rows: object[];
    monthsBack: number;
    monthsForward: number;
} & DispatchProp;

class GroupsTable extends Component<Props> {
    render() {
        if (this.props.rows.length === 0) return <></>;

        return (
            <Table
                rowKey="key"
                columns={this.props.columnDefinitions}
                dataSource={this.props.rows}
                loading={this.props.fetching}
                hidePagination={true}
                scroll={{
                    x: (this.props.monthsBack + this.props.monthsForward) * 100,
                }}
            />
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const projectionsState = commissionProjectionsSelector(state);

    return {
        fetching: projectionsState.fetching,
        columnDefinitions: projectionGroupsTableColumnsSelector(state),
        rows: projectionGroupTableRowsSelector(state),
    };
};

export default connect(mapStateToProps)(GroupsTable);
