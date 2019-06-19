import { Popconfirm } from 'antd';
import update from 'immutability-helper';
import React, { Component } from 'react';

import { getColumnDefinition } from '@/app/table';
import { ValidationResult } from '@/app/validation';
import { UNKNOWN_COMMISSION_TYPE_CODE } from '@/state/app/commission/lookups';
import { Sheet } from '@/state/app/commission/templates';
import { FormErrors, getTable, StopPropagation } from '@/ui/controls';

import EditSheet from './EditSheet';

const Table = getTable<Sheet>();

type Props = {
    sheets: Sheet[];
    onChange: (sheets: Sheet[]) => void;
    validationResults: ValidationResult[];
};

type State = {
    sheet: Sheet | null;
    sheetIndex: number | null;
};

class SheetList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sheet: null,
            sheetIndex: null,
        };
    }

    addSheet = (sheet: Sheet) => {
        let sheets: Sheet[] = [];

        if (this.state.sheetIndex !== null) {
            sheets = update(this.props.sheets, {
                [this.state.sheetIndex]: {
                    $set: sheet,
                },
            });
        } else {
            sheets = update(this.props.sheets, {
                $push: [sheet],
            });
        }

        this.props.onChange(sheets);
        this.cancelEditSheet();
    };

    newSheet = () => {
        const sheet: Sheet = {
            position: this.props.sheets.length + 1,
            config: {
                headerIdentifier: {
                    column: "",
                    value: "",
                },
                fields: [],
                commissionTypes: {
                    defaultCommissionTypeCode: UNKNOWN_COMMISSION_TYPE_CODE,
                    mappingTemplate: "",
                    types: [],
                },
            },
        };

        this.setState({
            sheet: sheet,
            sheetIndex: null,
        });
    };

    editSheet = (index: number) => {
        this.setState({
            sheet: { ...this.props.sheets[index] },
            sheetIndex: index,
        });
    };

    cancelEditSheet = () => {
        this.setState({
            sheet: null,
            sheetIndex: null,
        });
    };

    deleteSheet = (index: number) => {
        const sheets = update(this.props.sheets, { $splice: [[index, 1]] });
        this.props.onChange(sheets);
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<Sheet>();
        return [
            getColumn(
                "position",
                "Position",
                {},
                {
                    render: (position: number) => {
                        return `Sheet ${position}`;
                    },
                }
            ),
            getColumn(
                "position",
                "Actions",
                {},
                {
                    render: (position: number, record: Sheet, index: number) => {
                        return (
                            <StopPropagation>
                                <a href="#" className="mr-1" onClick={() => this.editSheet(index)}>
                                    Edit
                                </a>
                                {this.props.sheets.length > 1 && (
                                    <Popconfirm
                                        title="Are you sure remove this sheet? All sheet config will be lost."
                                        onConfirm={() => this.deleteSheet(index)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <a href="#">Remove</a>
                                    </Popconfirm>
                                )}
                            </StopPropagation>
                        );
                    },
                }
            ),
        ];
    };

    render() {


        return (
            <>
                <FormErrors validationResults={this.props.validationResults} />

                <EditSheet
                    sheet={this.state.sheet}
                    cancel={this.cancelEditSheet}
                    newSheet={this.newSheet}
                    onSave={this.addSheet}
                />

                <Table
                    className="mt-1"
                    rowKey="position"
                    columns={this.getColumns()}
                    dataSource={this.props.sheets}
                    onRowClick={(sheet, index) => this.editSheet(index)}
                />
            </>
        );
    }
}

export default SheetList;
