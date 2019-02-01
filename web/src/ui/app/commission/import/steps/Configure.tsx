import { Alert, Col, Icon, List, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { v4 } from 'uuid';

import { getColumn } from '@/app/table';
import {
    commissionImportNextStep, commissionImportPreviousStep, commissionImportSelectedColumnsSelector,
    commissionImportSelector, commissionImportTableRowsSelector, ImportColumn, ImportCommission, ImportTableRow,
    receiveCommissionImportCommissions, receiveCommissionImportSelectedColumns
} from '@/state/app/commission/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

const Option = Select.Option;

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
    selectedImportColumns: ImportColumn[];
    selectedColumns: string[];
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
        const commissions: ImportCommission[] = this.props.rows.map(r => {
            return {
                _id: v4(),
                ...r
            };
        });
        this.props.dispatch(receiveCommissionImportCommissions(commissions));
        this.props.dispatch(commissionImportNextStep());
    };

    onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        const columns = arrayMove(
            this.props.selectedColumns,
            oldIndex,
            newIndex
        );
        this.props.dispatch(receiveCommissionImportSelectedColumns(columns));
    };

    getColumns = () => {
        return this.props.selectedImportColumns.map(c =>
            getColumn(c.id, c.name, { sorter: undefined })
        );
    };

    onSelectedColumnChange = (columns: string[]) => {
        this.props.dispatch(receiveCommissionImportSelectedColumns(columns));
    };

    render() {
        return (
            <>
                <Row type="flex" justify="space-between" className="mb-1">
                    <Col>
                        <Button
                            noLeftMargin={true}
                            onClick={() =>
                                this.props.dispatch(
                                    commissionImportPreviousStep()
                                )
                            }
                        >
                            <Icon type="left" />
                            Previous
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={this.next}>
                            Next
                            <Icon type="right" />
                        </Button>
                    </Col>
                </Row>

                <Alert
                    showIcon
                    message="Check the preview table to confirm that columns are in the correct order, if not re-order by dragging the columns below"
                    type="info"
                />

                <Row gutter={24}>
                    <Col span={12}>
                        <h4 className="mt-1">Column Selection</h4>

                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            value={this.props.selectedColumns}
                            onChange={this.onSelectedColumnChange}
                        >
                            {this.props.columns.map(c => {
                                return <Option key={c.id}>{c.name}</Option>;
                            })}
                        </Select>

                        <h4 className="mt-1">Column Order</h4>

                        <SortableList
                            items={this.props.selectedImportColumns}
                            onSortEnd={this.onSortEnd}
                        />
                    </Col>

                    <Col span={12}>
                        <h4 className="mt-1">Preview</h4>

                        <Table
                            rowKey="_id"
                            columns={this.getColumns()}
                            dataSource={this.props.rows.slice(0, 5)}
                            hidePagination={true}
                        />
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = commissionImportSelector(state);

    return {
        columns: importState.columns,
        selectedColumns: importState.selectedColumns,
        selectedImportColumns: commissionImportSelectedColumnsSelector(state),
        rows: commissionImportTableRowsSelector(state)
    };
};

export default connect(mapStateToProps)(Configure);
