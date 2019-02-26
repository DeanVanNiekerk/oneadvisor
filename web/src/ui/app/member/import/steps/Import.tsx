import { Card, Col, Collapse, Icon, Modal, Progress, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { downloadExcel } from '@/app/excel/helpers';
import { getColumn } from '@/app/table';
import { parseValidationErrors } from '@/app/validation';
import {
    ImportColumn, ImportMember, importMember, importMemberClearResults, importMemberReset, memberImportPreviousStep,
    memberImportProgressPercentSelector, memberImportSelectedColumnsSelector, memberImportSelector, ResultFailure
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

import StepProgress from '../StepProgress';

const Panel = Collapse.Panel;

type Props = {
    fileName: string;
    members: ImportMember[];
    resultsSuccess: ImportMember[];
    resultsFailure: ResultFailure[];
    progressPercent: number;
    columns: ImportColumn[];
} & DispatchProp;

class Import extends Component<Props> {
    componentDidUpdate() {
        if (this.props.progressPercent === 100) {
            if (this.props.resultsSuccess.length === this.props.members.length)
                this.success();
            else this.failure();
        }
    }

    startImport = () => {
        this.props.dispatch(importMemberClearResults());
        this.props.members.forEach(m => {
            this.props.dispatch(importMember(m));
        });
    };

    isImporting = () => {
        return (
            this.props.progressPercent !== 0 &&
            this.props.progressPercent !== 100
        );
    };

    success = () => {
        Modal.success({
            title: 'Success',
            content: 'All member data has been succesfully imported.'
        });
    };

    failure = () => {
        Modal.error({
            title: 'Failure',
            content:
                'Some errors occured during the import process, please review the Error table for more information.'
        });
    };

    showError = (record: ResultFailure) => {
        const validationErrors = parseValidationErrors(record.error);

        Modal.error({
            title: 'Error Details',
            width: 720,
            content: (
                <div>
                    <Collapse defaultActiveKey={['1', '2']}>
                        <Panel header="Error Messages" key="1">
                            {validationErrors.map(result => {
                                return (
                                    <div key={result.propertyName}>
                                        <b>{result.propertyName}: </b>
                                        <span className="text-error">
                                            {result.errorMessage}
                                        </span>
                                    </div>
                                );
                            })}
                            {validationErrors.length === 0 && (
                                <span className="text-error">
                                    Unhandled Server Error
                                </span>
                            )}
                        </Panel>
                        <Panel header="Record Data" key="2">
                            {this.props.columns.map(column => {
                                return (
                                    <div key={column.id}>
                                        <b>{column.name}: </b>
                                        {record.importMember[column.id]}
                                    </div>
                                );
                            })}
                        </Panel>

                        <Panel header="Raw Error Data" key="3">
                            <pre>{record.error}</pre>
                        </Panel>
                    </Collapse>
                </div>
            )
        });
    };

    getColumns = () => {
        const columns: any = [];

        const idNumberColumn = getColumn('idNumber', 'Record', {
            sorter: undefined,
            render: (value: any, record: ResultFailure) => {
                {
                    return this.props.columns.map(column => {
                        return (
                            <span key={column.id}>
                                {record.importMember[column.id]};{' '}
                            </span>
                        );
                    });
                }
            }
        });

        const actionColumn = getColumn('error', 'Error Detail', {
            sorter: undefined,
            fixed: 'right',
            render: (value: any, record: ResultFailure) => {
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
            }
        });

        columns.push(idNumberColumn);
        columns.push(actionColumn);

        return columns;
    };

    reset = () => {
        this.props.dispatch(importMemberReset());
    };

    downloadErrors = () => {
        const errorIds = this.props.resultsFailure.map(
            result => result.importMember._id
        );

        const errorRows = this.props.members.filter(m => {
            return errorIds.indexOf(m._id) !== -1;
        });

        const data = errorRows.map(e => {
            delete e._id;
            delete e.policyCompanyId;
            return e;
        });

        const fileName = this.props.fileName;
        const index = fileName.lastIndexOf('.');

        const errorFileName =
            fileName.slice(0, index) + '_Errors' + fileName.slice(index);

        downloadExcel(data, errorFileName);
    };

    render() {
        return (
            <>
                <StepProgress
                    previousDisabled={this.isImporting()}
                    onPrevious={() =>
                        this.props.dispatch(memberImportPreviousStep())
                    }
                    onNext={this.startImport}
                    nextLoading={this.isImporting()}
                    nextText={
                        this.props.progressPercent === 100
                            ? 'Import Again'
                            : 'Start Import'
                    }
                    nextIcon="cloud-upload"
                />

                <Row gutter={24}>
                    <Col span={4}>
                        <Card title="Progress" className="text-center">
                            <Progress
                                type="circle"
                                percent={this.props.progressPercent}
                            />
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
                            <Icon type="sync" />
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
                            {this.props.resultsFailure.length === 0 && (
                                <p>No errors.</p>
                            )}
                            {this.props.resultsFailure.length > 0 && (
                                <Table
                                    rowKey="_id"
                                    columns={this.getColumns()}
                                    dataSource={this.props.resultsFailure}
                                    scroll={{
                                        x: true
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
    const importState = memberImportSelector(state);

    return {
        fileName: importState.fileName,
        members: importState.members,
        resultsSuccess: importState.resultsSuccess,
        resultsFailure: importState.resultsFailure,
        progressPercent: memberImportProgressPercentSelector(state),
        columns: memberImportSelectedColumnsSelector(state)
    };
};

export default connect(mapStateToProps)(Import);
