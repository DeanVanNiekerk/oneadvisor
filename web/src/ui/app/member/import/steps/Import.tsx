import { Col, Icon, Modal, Popover, Progress, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import {
    ImportMember, importMember, importMemberClearResults, importMemberReset, memberImportPreviousStep,
    memberImportProgressPercentSelector, memberImportSelector, ResultFailure
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

/*
InvalidOperationException: The property 'Id' on entity type 'MemberPolicyEntity' 
is part of a key and so cannot be modified or marked as modified. 
To change the principal of an existing entity with an identifying foreign key first delete the dependent and invoke 'SaveChanges' 
then associate the dependent with the new principal.
*/

type Props = {
    members: ImportMember[];
    resultsSuccess: ImportMember[];
    resultsFailure: ResultFailure[];
    progressPercent: number;
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
        Modal.error({
            title: 'Error Details',
            width: 720,
            content: (
                <div>
                    <div>ID Number: {record.importMember.idNumber}</div>
                    <div>First Name: {record.importMember.firstName}</div>
                    <div>Last Name: {record.importMember.lastName}</div>
                    <div>Policy Number: {record.importMember.policyNumber}</div>
                    <div>
                        Broker Full Name: {record.importMember.userFullName}
                    </div>
                    <pre>{record.error}</pre>
                </div>
            )
        });
    };

    getColumns = () => {
        const columns: any = [];

        const idNumberColumn = getColumn('idNumber', 'ID Number', {
            sorter: undefined,
            render: (value: any, record: ResultFailure) => {
                return record.importMember.idNumber;
            }
        });

        const actionColumn = getColumn('error', 'Detail', {
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

                <Row>
                    <Col span={4}>
                        <h4 className="mt-1">Progress</h4>

                        <Progress
                            type="circle"
                            percent={this.props.progressPercent}
                        />
                    </Col>
                    <Col span={4}>
                        <h4 className="mt-1">Results</h4>

                        <div>
                            <span>Successful imports: </span>
                            <strong className="text-success">
                                {this.props.resultsSuccess.length}
                            </strong>
                        </div>
                        {this.props.resultsFailure.length > 0 && (
                            <>
                                <span>Import failures: </span>
                                <strong className="text-error">
                                    {this.props.resultsFailure.length}
                                </strong>
                            </>
                        )}
                    </Col>
                    {this.props.resultsFailure.length > 0 && (
                        <Col span={16}>
                            <h4 className="mt-1 text-error">Errors</h4>

                            <Table
                                rowKey="_id"
                                columns={this.getColumns()}
                                dataSource={this.props.resultsFailure}
                            />
                        </Col>
                    )}
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
        progressPercent: memberImportProgressPercentSelector(state)
    };
};

export default connect(mapStateToProps)(Import);
