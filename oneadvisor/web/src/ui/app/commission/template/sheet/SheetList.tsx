import { Popconfirm } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { hasUseCase } from "@/app/identity";
import { getColumnDefinition } from "@/app/table";
import { ValidationResult } from "@/app/validation";
import { UNKNOWN_COMMISSION_TYPE_CODE } from "@/state/app/commission/lookups";
import { Sheet } from "@/state/app/commission/templates";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { FormErrors, getTable, StopPropagation } from "@/ui/controls";

import EditSheet from "./EditSheet";

const Table = getTable<Sheet>();

type Props = {
    sheets: Sheet[];
    onChange: (sheets: Sheet[]) => void;
    validationResults: ValidationResult[];
    useCases: string[];
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
                groups: [],
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
                "",
                "Actions",
                {},
                {
                    render: (position: number, record: Sheet, index: number) => {
                        return (
                            <StopPropagation>
                                {hasUseCase("com_edit_commission_statement_templates", this.props.useCases) && (
                                    <a href="#" className="mr-1" onClick={() => this.editSheet(index)}>
                                        Edit
                                    </a>
                                )}
                                {this.props.sheets.length > 1 &&
                                    hasUseCase("com_edit_commission_statement_templates", this.props.useCases) && (
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
                    onRowClickRequiredUseCase="com_edit_commission_statement_templates"
                    onRowClick={(sheet, index) => this.editSheet(index)}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(SheetList);
