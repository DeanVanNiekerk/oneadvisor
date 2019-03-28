import { Alert, Col, Icon, List, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { arrayMove, SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { v4 } from 'uuid';

import { getColumn } from '@/app/table';
import {
    ImportClient, ImportColumn, ImportTableRow, clientImportNextStep, clientImportPreviousStep,
    clientImportSelectedColumnsSelector, clientImportSelector, clientImportTableRowsSelector,
    receiveClientImportClients, receiveClientImportSelectedColumns
} from '@/state/app/client/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

import StepProgress from '../StepProgress';

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
            columns: props.columns,
        };
    }

    next = () => {
        const clients: ImportClient[] = this.props.rows.map(r => {
            return {
                _id: v4(),
                idNumber: r.idNumber,
                ...r,
            };
        });
        this.props.dispatch(receiveClientImportClients(clients));
        this.props.dispatch(clientImportNextStep());
    };

    onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        const columns = arrayMove(
            this.props.selectedColumns,
            oldIndex,
            newIndex
        );
        this.props.dispatch(receiveClientImportSelectedColumns(columns));
    };

    getColumns = () => {
        return this.props.selectedImportColumns.map(c =>
            getColumn(c.id, c.name, { sorter: undefined })
        );
    };

    onSelectedColumnChange = (columns: string[]) => {
        this.props.dispatch(receiveClientImportSelectedColumns(columns));
    };

    render() {
        return (
            <>
                <StepProgress
                    onPrevious={() =>
                        this.props.dispatch(clientImportPreviousStep())
                    }
                    onNext={this.next}
                />

                <Row>
                    <Col span={24}>
                        <h4>Column Selection</h4>

                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Please select"
                            value={this.props.selectedColumns}
                            onChange={this.onSelectedColumnChange}
                        >
                            {this.props.columns.map(c => {
                                return <Option key={c.id}>{c.name}</Option>;
                            })}
                        </Select>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={8}>
                        <h4 className="mt-1">Column Order</h4>

                        <SortableList
                            items={this.props.selectedImportColumns}
                            onSortEnd={this.onSortEnd}
                        />
                    </Col>

                    <Col span={16}>
                        <h4 className="mt-1">Preview</h4>

                        <Table
                            rowKey="_id"
                            columns={this.getColumns()}
                            dataSource={this.props.rows.slice(0, 5)}
                            hidePagination={true}
                            scroll={{
                                x: true,
                            }}
                        />
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = clientImportSelector(state);

    return {
        columns: importState.columns,
        selectedColumns: importState.selectedColumns,
        selectedImportColumns: clientImportSelectedColumnsSelector(state),
        rows: clientImportTableRowsSelector(state),
        currentStepIndex: importState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(Configure);
