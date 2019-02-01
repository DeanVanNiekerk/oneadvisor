import { Card, Col, Collapse, Icon, Modal, Progress, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import { parseValidationErrors } from '@/app/validation';
import {
    ImportColumn, ImportMember, importMember, importMemberClearResults, importMemberReset, memberImportPreviousStep,
    memberImportProgressPercentSelector, memberImportSelectedColumnsSelector, memberImportSelector, ResultFailure
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

const Panel = Collapse.Panel;

type Props = {
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

    render() {
        return (
            <>
                <Row type="flex" justify="space-between" className="mb-1">
                    <Col>
                        <Button
                            disabled={this.isImporting()}
                            noLeftMargin={true}
                            onClick={() =>
                                this.props.dispatch(memberImportPreviousStep())
                            }
                        >
                            <Icon type="left" />
                            Previous
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            visible={this.props.progressPercent === 100}
                            onClick={this.reset}
                        >
                            Import a New File
                            <Icon type="sync" />
                        </Button>
                        <Button
                            type="primary"
                            loading={this.isImporting()}
                            onClick={this.startImport}
                        >
                            {this.props.progressPercent === 100
                                ? 'Import Again'
                                : 'Start Import'}
                            <Icon type="cloud-upload" />
                        </Button>
                    </Col>
                </Row>

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
                    </Col>

                    <Col span={14}>
                        <Card title="Errors">
                            {this.props.resultsFailure.length === 0 && (
                                <p>No errors.</p>
                            )}
                            {this.props.resultsFailure.length > 0 && (
                                <Table
                                    rowKey="_id"
                                    columns={this.getColumns()}
                                    dataSource={this.props.resultsFailure}
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
        members: importState.members,
        resultsSuccess: importState.resultsSuccess,
        resultsFailure: importState.resultsFailure,
        progressPercent: memberImportProgressPercentSelector(state),
        columns: memberImportSelectedColumnsSelector(state)
    };
};

export default connect(mapStateToProps)(Import);
