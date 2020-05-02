import { Popconfirm, Popover } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { areEqual, formatCurrency } from "@/app/utils";
import { RootState } from "@/state";
import {
    CommissionError,
    commissionErrorsSelector,
    CommissionImportData,
    deleteMappingError,
    fetchCommissionErrors,
    fetchMappingError,
    mappingErrorVisible,
    receivePageOptions,
    receiveSortOptions,
} from "@/state/commission/errors";
import { Statement } from "@/state/commission/statements";
import { getTable } from "@/ui/controls";
import { StopPropagation } from "@/ui/controls/common/StopPropagation";
import { InfoCircleOutlined } from "@ant-design/icons";

import EditMappingError from "../mapping/EditMappingError";
import ErrorData from "./ErrorData";

const Table = getTable<CommissionError>();

type Props = {
    statement: Statement;
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const ErrorList: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        load();
    }, [props.pageOptions, props.sortOptions]);

    useEffect(() => {
        //If we are NOT on the first page and there are no errors, move to first page
        if (props.pageOptions.number !== 1 && props.errors.length === 0) {
            props.updatePageOptions({
                ...props.pageOptions,
                number: props.pageOptions.number - 1,
            });
        }
    }, [props.errors]);

    const load = () => {
        props.fetchCommissionErrors(props.statement.id);
    };

    const editMappingError = (id: string) => {
        props.editMappingError(props.statement.id, id);
    };

    const deleteError = (id: string) => {
        props.deleteMappingError(props.statement.id, id, load);
    };

    const onSaved = () => {
        load();
        if (props.onSaved) props.onSaved();
    };

    const getColumns = () => {
        const getColumn = getColumnDefinition<
            CommissionError & {
                info: string;
                policyNumber: string;
                amountIncludingVAT: number;
                vat: number;
            }
        >(true);

        return [
            getColumn(
                "info",
                "Excel",
                {},
                {
                    align: "center",
                    render: (_data: CommissionImportData, error: CommissionError) => {
                        return (
                            <Popover
                                content={<ErrorData data={error.data} />}
                                title="Excel Data"
                                placement="leftTop"
                                style={{
                                    width: "450px",
                                }}
                            >
                                <InfoCircleOutlined />
                            </Popover>
                        );
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "policyNumber",
                "Policy Number",
                {},
                {
                    render: (_data: CommissionImportData, error: CommissionError) => {
                        return error.data.policyNumber;
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "amountIncludingVAT",
                "Amount Incl VAT",
                {},
                {
                    render: (_data: CommissionImportData, error: CommissionError) => {
                        return formatCurrency(error.data.amountIncludingVAT);
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "vat",
                "VAT",
                {},
                {
                    render: (_data: CommissionImportData, error: CommissionError) => {
                        return formatCurrency(error.data.vat);
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "id",
                "Actions",
                {},
                {
                    render: (id: string) => {
                        return (
                            <StopPropagation>
                                <Popconfirm
                                    title="Are you sure remove this commission record?"
                                    onConfirm={() => deleteError(id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <a href="#">Remove</a>
                                </Popconfirm>
                            </StopPropagation>
                        );
                    },
                    sorter: false,
                }
            ),
        ];
    };

    const onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions) => {
        if (!areEqual(props.pageOptions, pageOptions)) props.updatePageOptions(pageOptions);
        if (!areEqual(props.sortOptions, sortOptions)) props.updateSortOptions(sortOptions);
    };

    return (
        <>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.errors}
                loading={props.fetching}
                onRowClick={(error) => editMappingError(error.id)}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
            />
            <EditMappingError statement={props.statement} onSaved={onSaved} />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const errorsState = commissionErrorsSelector(state);

    return {
        errors: errorsState.items,
        fetching: errorsState.fetching,
        pageOptions: errorsState.pageOptions,
        sortOptions: errorsState.sortOptions,
        totalItems: errorsState.totalItems,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        fetchCommissionErrors: (statementId: string) => {
            dispatch(fetchCommissionErrors(statementId));
        },
        editMappingError: (statementId: string, commissionErrorId: string) => {
            dispatch(fetchMappingError(statementId, commissionErrorId));
            dispatch(mappingErrorVisible(true));
        },
        deleteMappingError: (
            statementId: string,
            commissionErrorId: string,
            onDeleted: () => void
        ) => {
            dispatch(deleteMappingError(statementId, commissionErrorId, onDeleted));
        },
        updatePageOptions: (pageOptions: PageOptions) => {
            dispatch(receivePageOptions(pageOptions));
        },
        updateSortOptions: (sortOptions: SortOptions) => {
            dispatch(receiveSortOptions(sortOptions));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorList);
