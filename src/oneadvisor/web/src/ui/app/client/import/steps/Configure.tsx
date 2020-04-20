import { Col, List, Row, Select } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { arrayMove, SortableContainer, SortableElement, SortEnd } from "react-sortable-hoc";
import { v4 } from "uuid";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    clientImportNextStep,
    clientImportPreviousStep,
    clientImportSelectedColumnsSelector,
    clientImportSelector,
    clientImportTableRowsSelector,
    ImportClient,
    ImportColumn,
    ImportTableRow,
    receiveClientImportClients,
    receiveClientImportSelectedColumns,
} from "@/state/client/import";
import { getTable } from "@/ui/controls";

import StepProgress from "../StepProgress";

const Table = getTable<ImportTableRow>();

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
                <SortableItem key={`item-${index}`} index={index} value={item} />
            )}
        />
    );
});

type Props = {
    columns: ImportColumn[];
    selectedImportColumns: ImportColumn[];
    selectedColumns: (keyof ImportClient)[];
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
        const clients: ImportClient[] = this.props.rows.map((r) => {
            return {
                _id: v4(),
                ...r,
                idNumber: this.ensureString(r.idNumber) || "",
                cellphone: this.ensureString(r.cellphone),
                taxNumber: this.ensureString(r.taxNumber),
                policyNumber: this.ensureString(r.policyNumber),
            };
        });
        this.props.dispatch(receiveClientImportClients(clients));
        this.props.dispatch(clientImportNextStep());
    };

    ensureString = (value: string | number | undefined): string | null => {
        if (typeof value === "number") return value.toString();

        if (value === undefined) return null;

        return value;
    };

    onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
        const columns = arrayMove(this.props.selectedColumns, oldIndex, newIndex);
        this.props.dispatch(receiveClientImportSelectedColumns(columns));
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<ImportTableRow>();
        return this.props.selectedImportColumns.map((c) =>
            getColumn(c.id, c.name, {}, { sorter: undefined })
        );
    };

    onSelectedColumnChange = (columns: (keyof ImportClient)[]) => {
        this.props.dispatch(receiveClientImportSelectedColumns(columns));
    };

    render() {
        return (
            <>
                <StepProgress
                    onPrevious={() => this.props.dispatch(clientImportPreviousStep())}
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
                            {this.props.columns.map((c) => {
                                return (
                                    <Option key={c.id} value={c.id}>
                                        {c.name}
                                    </Option>
                                );
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
                                x: "max-content",
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
