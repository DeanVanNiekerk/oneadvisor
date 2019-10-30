import { Icon, Popconfirm, Popover } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { areEqual, formatCurrency, splitCamelCase } from "@/app/utils";
import {
    CommissionError, commissionErrorsSelector, CommissionImportData, fetchCommissionErrors, fetchMappingError,
    mappingErrorVisible, receivePageOptions, receiveSortOptions
} from "@/state/app/commission/errors";
import { Statement } from "@/state/app/commission/statements";
import { RootState } from "@/state/rootReducer";
import { getTable, StopPropagation } from "@/ui/controls";

import EditMappingError from "../mapping/EditMappingError";

const Table = getTable<CommissionError>();

type Props = {
    statement: Statement;
    onSaved?: () => void;
} & PropsFromState & PropsFromDispatch;

const ErrorList: React.FC<Props> = (props: Props) => {

    useEffect(() => {
        props.fetchCommissionErrors(props.statement.id);
    }, [props.pageOptions, props.sortOptions]);


    // componentDidUpdate(prevProps: Props) {
    //     if (prevProps.pageOptions != this.props.pageOptions || prevProps.sortOptions != this.props.sortOptions)
    //         this.loadErrors();

    //     if (this.props.pageOptions.number !== 1 && this.props.errors.length === 0 && prevProps.errors.length !== 0) {
    //         this.props.dispatch(
    //             receivePageOptions({
    //                 ...this.props.pageOptions,
    //                 number: this.props.pageOptions.number - 1,
    //             })
    //         );
    //     }
    // }

    const deleteError = (id: string) => {
        //this.props.dispatch(deleteMappingError(this.props.statement.id, id, this.loadErrors));
    };

    const onSaved = () => {
        props.fetchCommissionErrors(props.statement.id);
        if (props.onSaved) props.onSaved();
    };

    const errorData = (data: CommissionImportData) => {
        return (
            <div>
                {Object.keys(data)
                    .filter(key => {
                        const value = data[key];
                        return value !== "" && value !== null;
                    })
                    .map(key => {
                        return (
                            <p>
                                <b>
                                    {splitCamelCase(key)}
                                    {": "}
                                </b>
                                {data[key]}
                            </p>
                        );
                    })}
            </div>
        );
    };

    const getColumns = () => {
        var getColumn = getColumnDefinition<CommissionError>(true);

        return [
            getColumn(
                "data",
                "Excel",
                {},
                {
                    align: "center",
                    render: (data: CommissionImportData) => {
                        return (
                            <Popover
                                content={errorData(data)}
                                title="Excel Data"
                                placement="leftTop"
                                style={{
                                    width: "450px",
                                }}
                            >
                                <Icon type="info-circle" />
                            </Popover>
                        );
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "data",
                "Policy Number",
                {},
                {
                    render: (data: CommissionImportData) => {
                        return data.policyNumber;
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "data",
                "Amount Incl VAT",
                {},
                {
                    render: (data: CommissionImportData) => {
                        return formatCurrency(data.amountIncludingVAT);
                    },
                    sorter: false,
                }
            ),
            getColumn(
                "data",
                "VAT",
                {},
                {
                    render: (data: CommissionImportData) => {
                        return formatCurrency(data.vat);
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

    const editMappingError = (id: string) => {
        props.editMappingError(props.statement.id, id);
    };

    return (
        <>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.errors}
                loading={props.fetching}
                onRowClick={error => editMappingError(error.id)}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
            />
            <EditMappingError
                statement={props.statement}
                onSaved={onSaved}
            />
        </>
    );
}

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
        updatePageOptions: (pageOptions: PageOptions) => {
            dispatch(receivePageOptions(pageOptions));
        },
        updateSortOptions: (sortOptions: SortOptions) => {
            dispatch(receiveSortOptions(sortOptions));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorList);
