import { Alert, Col, List, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';

import { getColumn } from '@/app/table';
import {
    ImportColumn, ImportTableRow, memberImportSelector, memberImportTableRowsSelector, receiveMemberImportColumns
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Table } from '@/ui/controls';

type SortableItemProps = { value: ImportColumn };
const SortableItem = SortableElement((props: SortableItemProps) => (
    <List.Item className="draggable">{props.value.name}</List.Item>
));

type SortableListProps = { items: ImportColumn[] };
const SortableList = SortableContainer((props: SortableListProps) => {
    return (
        <List
            bordered
            dataSource={props.items}
            renderItem={(item: ImportColumn, index: number) => (
                <SortableItem
                    key={`item-${index}`}
                    index={index}
                    value={item}
                />
            )}
        />
    );
});

type Props = {
    columns: ImportColumn[];
    rows: ImportTableRow[];
} & DispatchProp;

class Configure extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns
        };
    }

    onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        const columns = arrayMove(this.props.columns, oldIndex, newIndex);
        this.props.dispatch(receiveMemberImportColumns(columns));
    };

    getColumns = () => {
        return this.props.columns.map(c =>
            getColumn(c.id, c.name, { sorter: undefined })
        );
    };

    render() {
        return (
            <>
                <Alert
                    showIcon
                    message="Check the preview table to confirm that columns are in the correct order, if not re-order by dragging the columns below"
                    type="info"
                />

                <Row gutter={24}>
                    <Col span={12}>
                        <h4 className="mt-1">Column Order</h4>

                        <SortableList
                            items={this.props.columns}
                            onSortEnd={this.onSortEnd}
                        />
                    </Col>

                    <Col span={12}>
                        <h4 className="mt-1">Preview</h4>

                        <Table
                            rowKey="id"
                            columns={this.getColumns()}
                            dataSource={this.props.rows}
                            hidePagination={true}
                        />
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);

    return {
        columns: importState.columns,
        rows: memberImportTableRowsSelector(state).slice(0, 5)
    };
};

export default connect(mapStateToProps)(Configure);
