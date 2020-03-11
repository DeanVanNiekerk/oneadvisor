import { Card, Col, Collapse, Modal, Progress, Row } from "antd";
import { ColumnProps } from "antd/lib/table";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { downloadExcel } from "@/app/excel/helpers";
import { getColumnDefinition } from "@/app/table";
import { parseValidationErrors } from "@/app/validation";
import {
    clientImportPreviousStep,
    clientImportProgressPercentSelector,
    clientImportSelectedColumnsSelector,
    clientImportSelector,
    ImportClient,
    importClient,
    importClientClearResults,
    importClientReset,
    ImportColumn,
    ResultFailure,
} from "@/state/app/client/import";
import { RootState } from "@/state/rootReducer";
import { Button, getTable } from "@/ui/controls";
import { SyncOutlined } from "@ant-design/icons";

import StepProgress from "../StepProgress";

const Table = getTable<ResultFailure>();

const Panel = Collapse.Panel;

type Props = {
    fileName: string;
    clients: ImportClient[];
    resultsSuccess: ImportClient[];
    resultsFailure: ResultFailure[];
    progressPercent: number;
    columns: ImportColumn[];
} & DispatchProp;

class Import extends Component<Props> {
    componentDidUpdate() {
        if (this.props.progressPercent === 100) {
            if (this.props.resultsSuccess.length === this.props.clients.length) this.success();
            else this.failure();
        }
    }

    startImport = () => {
        this.props.dispatch(importClientClearResults());
        this.props.clients.forEach(m => {
            this.props.dispatch(importClient(m));
        });
    };

    isImporting = () => {
        return this.props.progressPercent !== 0 && this.props.progressPercent !== 100;
    };

    success = () => {
        Modal.success({
            title: "Success",
            content: "All client data has been succesfully imported.",
        });
    };

    failure = () => {
        Modal.error({
            title: "Failure",
            content:
                "Some errors occured during the import process, please review the Error table for more information.",
        });
    };

    showError = (record: ResultFailure) => {
        const validationErrors = parseValidationErrors(record.error);

        Modal.error({
            title: "Error Details",
            width: 720,
            content: (
                <div>
                    <Collapse defaultActiveKey={["1", "2"]}>
                        <Panel header="Error Messages" key="1">
                            {validationErrors.map(result => {
                                return (
                                    <div key={result.propertyName}>
                                        <b>{result.propertyName}: </b>
                                        <span className="text-error">{result.errorMessage}</span>
                                    </div>
                                );
                            })}
                            {validationErrors.length === 0 && (
                                <span className="text-error">Unhandled Server Error</span>
                            )}
                        </Panel>
                        <Panel header="Record Data" key="2">
                            {this.props.columns.map(column => {
                                return (
                                    <div key={column.id}>
                                        <b>{column.name}: </b>
                                        {record.importClient[column.id]}
                                    </div>
                                );
                            })}
                        </Panel>

                        <Panel header="Raw Error Data" key="3">
                            <pre>{record.error}</pre>
                        </Panel>
                    </Collapse>
                </div>
            ),
        });
    };

    getColumns = () => {
        const columns: ColumnProps<ResultFailure>[] = [];

        const getColumn = getColumnDefinition<ResultFailure>();

        const idNumberColumn = getColumn(
            "_id",
            "Record",
            {},
            {
                sorter: undefined,
                render: (value: string, record: ResultFailure) => {
                    {
                        return this.props.columns.map(column => {
                            return <span key={column.id}>{record.importClient[column.id]}; </span>;
                        });
                    }
                },
            }
        );

        const actionColumn = getColumn(
            "error",
            "Error Detail",
            {},
            {
                sorter: undefined,
                fixed: "right",
                render: (value: string, record: ResultFailure) => {
                    return (
                        <Button
                            shape="circle"
                            icon="exclamation"
                            type="danger"
                            onClick={() => {
                                this.showError(record);
                            }}
                        />
                    );
                },
            }
        );

        columns.push(idNumberColumn);
        columns.push(actionColumn);

        return columns;
    };

    reset = () => {
        this.props.dispatch(importClientReset());
    };

    downloadErrors = () => {
        const errorIds = this.props.resultsFailure.map(result => result.importClient._id);

        const errorRows = this.props.clients.filter(m => {
            return errorIds.indexOf(m._id) !== -1;
        });

        const data = errorRows.map(e => {
            delete e._id;
            delete e.policyCompanyId;
            return e;
        });

        const fileName = this.props.fileName;
        const index = fileName.lastIndexOf(".");

        const errorFileName = fileName.slice(0, index) + "_Errors" + fileName.slice(index);

        downloadExcel(data, errorFileName);
    };

    render() {
        return (
            <>
                <StepProgress
                    previousDisabled={this.isImporting()}
                    onPrevious={() => this.props.dispatch(clientImportPreviousStep())}
                    onNext={this.startImport}
                    nextLoading={this.isImporting()}
                    nextText={this.props.progressPercent === 100 ? "Import Again" : "Start Import"}
                    nextIcon="cloud-upload"
                />

                <Row gutter={24}>
                    <Col span={4}>
                        <Card title="Progress" className="text-center">
                            <Progress type="circle" percent={this.props.progressPercent} />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Results">
                            <p>
                                <span>Successful imports: </span>
                                <strong className="text-success">
                                    {this.props.resultsSuccess.length}
                                </strong>
                            </p>
                            {this.props.resultsFailure.length > 0 && (
                                <p>
                                    <span>Import failures: </span>
                                    <strong className="text-error">
                                        {this.props.resultsFailure.length}
                                    </strong>
                                </p>
                            )}
                        </Card>
                        <Button
                            type="primary"
                            visible={this.props.progressPercent === 100}
                            onClick={this.reset}
                            noLeftMargin={true}
                            className="mt-1"
                        >
                            Import a New File
                            <SyncOutlined />
                        </Button>
                    </Col>

                    <Col span={14}>
                        <Card
                            title="Errors"
                            extra={
                                this.props.resultsFailure.length > 0 && (
                                    <Button
                                        type="danger"
                                        shape="round"
                                        icon="download"
                                        size="small"
                                        onClick={this.downloadErrors}
                                    >
                                        Download
                                    </Button>
                                )
                            }
                        >
                            {this.props.resultsFailure.length === 0 && <p>No errors.</p>}
                            {this.props.resultsFailure.length > 0 && (
                                <Table
                                    rowKey="_id"
                                    columns={this.getColumns()}
                                    dataSource={this.props.resultsFailure}
                                    scroll={{
                                        x: "max-content",
                                    }}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = clientImportSelector(state);

    return {
        fileName: importState.fileName,
        clients: importState.clients,
        resultsSuccess: importState.resultsSuccess,
        resultsFailure: importState.resultsFailure,
        progressPercent: clientImportProgressPercentSelector(state),
        columns: clientImportSelectedColumnsSelector(state),
    };
};

export default connect(mapStateToProps)(Import);
