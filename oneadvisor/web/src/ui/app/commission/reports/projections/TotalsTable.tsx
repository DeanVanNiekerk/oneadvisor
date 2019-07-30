import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { commissionProjectionsSelector } from "@/state/app/commission/reports";
import { RootState } from "@/state/rootReducer";
import { getTable } from "@/ui/controls";

const Table = getTable();

type Props = {} & DispatchProp;

class TotalsTable extends Component<Props> {
    getColumns = () => {
        var getColumn = getColumnDefinition();

        const columns = [
            getColumn(
                "earningsType",
                "",
                {},
                {
                    fixed: "left",
                }
            ),
            getColumn("jul2012", "Jul"),
        ];

        return columns;
    };

    render() {
        return (
            <Table
                rowKey="rowNumber"
                columns={this.getColumns()}
                dataSource={[]}
                //loading={this.props.fetching}
                externalDataSource={true}
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
        //filters: projectionsState.filters,
    };
};

export default connect(mapStateToProps)(TotalsTable);
