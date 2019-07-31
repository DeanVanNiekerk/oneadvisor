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
} & DispatchProp;

class GroupsTable extends Component<Props> {
    render() {
        console.log(JSON.stringify(this.props.columnDefinitions, null, 4));
        console.log(JSON.stringify(this.props.rows, null, 4));

        return (
            <Table
                rowKey="index"
                header="Grouped"
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
        columnDefinitions: projectionGroupsTableColumnsSelector(state),
        rows: projectionGroupTableRowsSelector(state),
    };
};

export default connect(mapStateToProps)(GroupsTable);
