import { Alert, Col, List, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { v4 } from 'uuid';

import { getColumn } from '@/app/table';
import {
    ImportColumn, ImportMember, ImportTableRow, memberImportNextStep, memberImportPreviousStep, memberImportSelector,
    memberImportTableRowsSelector, receiveMemberImportColumns, receiveMemberImportMembers
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

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

    next = () => {
        const members: ImportMember[] = this.props.rows.map(r => {
            return {
                _id: v4(),
                idNumber: r.idNumber,
                ...r
            };
        });
        this.props.dispatch(receiveMemberImportMembers(members));
        this.props.dispatch(memberImportNextStep());
    };

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
                            dataSource={this.props.rows.slice(0, 5)}
                            hidePagination={true}
                        />
                    </Col>
                </Row>

                <Row type="flex" justify="end" className="mt-1">
                    <Col>
                        <Button
                            onClick={() =>
                                this.props.dispatch(memberImportPreviousStep())
                            }
                        >
                            Previous
                        </Button>
                        <Button type="primary" onClick={this.next}>
                            Next
                        </Button>
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
        rows: memberImportTableRowsSelector(state)
    };
};

export default connect(mapStateToProps)(Configure);
