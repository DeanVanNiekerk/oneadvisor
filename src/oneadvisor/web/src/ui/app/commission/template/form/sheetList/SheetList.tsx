import { Popconfirm } from "antd";
import update from "immutability-helper";
import React, { useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { getValidationSubSet } from "@/app/validation";
import { UNKNOWN_COMMISSION_TYPE_CODE } from "@/state/commission/lookups";
import {
    commissionStatementTemplateSheetsSelector,
    commissionStatementTemplateValidationResultsSelector,
    modifyCommissionStatementTemplateSheets,
    Sheet,
} from "@/state/commission/templates";
import { RootState } from "@/state/rootReducer";
import { FormErrors, getTable, StopPropagation } from "@/ui/controls";

import EditSheet from "./EditSheet";

const Table = getTable<Sheet>();

type Props = PropsFromState & PropsFromDispatch;

const SheetList: React.FC<Props> = (props: Props) => {
    const [sheetIndex, setSheetIndex] = useState<number | null>(null);

    const clearSheetIndex = () => {
        setSheetIndex(null);
    };

    const getColumns = () => {
        const getColumn = getColumnDefinition<Sheet>();
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
                    render: (_position: number, _record: Sheet, index: number) => {
                        return (
                            <StopPropagation>
                                <a href="#" className="mr-1" onClick={() => setSheetIndex(index)}>
                                    Edit
                                </a>
                                {props.sheets.length > 1 && (
                                    <Popconfirm
                                        title="Are you sure remove this sheet? All sheet config will be lost."
                                        onConfirm={() => props.deleteSheet(index, props.sheets)}
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

    const sheet = sheetIndex !== null ? props.sheets[sheetIndex] : null;

    return (
        <>
            <FormErrors validationResults={props.validationResults} />

            <EditSheet
                sheet={sheet}
                cancel={clearSheetIndex}
                newSheet={() => props.newSheet(props.sheets)}
                onSave={(modifiedSheet: Sheet) => {
                    if (sheetIndex !== null)
                        props.saveSheet(sheetIndex, modifiedSheet, props.sheets, clearSheetIndex);
                }}
            />

            <Table
                className="mt-1"
                rowKey="position"
                columns={getColumns()}
                dataSource={props.sheets}
                onRowClick={(_sheet, index) => setSheetIndex(index)}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const sheets = commissionStatementTemplateSheetsSelector(state);

    return {
        sheets: sheets,
        validationResults: getValidationSubSet(
            `config.sheets`,
            commissionStatementTemplateValidationResultsSelector(state),
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        newSheet: (sheets: Sheet[]) => {
            const sheet: Sheet = {
                position: sheets.length + 1,
                config: {
                    headerIdentifier: {
                        column: "",
                        value: "",
                    },
                    amountIdentifier: {
                        column: "",
                        value: "",
                        type: "excludingVat",
                    },
                    fields: [],
                    commissionTypes: {
                        defaultCommissionTypeCode: UNKNOWN_COMMISSION_TYPE_CODE,
                        mappingTemplate: "",
                        types: [],
                    },
                    groups: [],
                    vatRates: [],
                    exchangeRates: {
                        headerIdentifier: {
                            column: "",
                            value: "",
                        },
                        currencyColumn: "",
                        exchangeRateColumn: "",
                    },
                },
            };

            const modifiedSheets = update(sheets, { $push: [sheet] });

            dispatch(modifyCommissionStatementTemplateSheets(modifiedSheets));
        },
        saveSheet: (
            sheetIndex: number,
            sheet: Sheet,
            sheets: Sheet[],
            clearSheetIndex: () => void
        ) => {
            const modifiedSheets: Sheet[] = update(sheets, {
                [sheetIndex]: {
                    $set: sheet,
                },
            });
            dispatch(modifyCommissionStatementTemplateSheets(modifiedSheets));
            clearSheetIndex();
        },
        deleteSheet: (sheetIndex: number, sheets: Sheet[]) => {
            const modifiedSheets = update(sheets, { $splice: [[sheetIndex, 1]] });
            dispatch(modifyCommissionStatementTemplateSheets(modifiedSheets));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SheetList);
