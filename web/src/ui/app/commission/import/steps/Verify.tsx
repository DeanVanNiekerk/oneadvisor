import { Col, DatePicker, Form, Icon, Popconfirm, Row, Select } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import {
    commissionImportNextStep, commissionImportPreviousStep, commissionImportSelectedColumnsSelector,
    commissionImportSelector, ImportColumn, ImportCommission, importCommissionClearResults, receiveCommissionImportDate,
    removeCommissionImportCommission, updateCommissionImportDate
} from '@/state/app/commission/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

const FormItem = Form.Item;

type Props = {
    columns: ImportColumn[];
    commissions: ImportCommission[];
    date: string;
} & DispatchProp;

class Verify extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns
        };
    }

    removeImportCommission = (id: string) => {
        this.props.dispatch(removeCommissionImportCommission(id));
    };

    selectDate = (momentDate: moment.Moment, date: string) => {
        this.props.dispatch(receiveCommissionImportDate(date));
    };

    getColumns = () => {
        const columns = this.props.columns.map(c =>
            getColumn(c.id, c.name, {
                showSearchFilter: true,
                sorter: undefined
            })
        );

        const actionsColumn = getColumn('actions', 'Actions', {
            sorter: undefined,
            render: (value: any, record: ImportCommission) => {
                return (
                    <Popconfirm
                        title="Are you sure remove this record?"
                        onConfirm={() =>
                            this.removeImportCommission(record._id)
                        }
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href="#">Remove</a>
                    </Popconfirm>
                );
            }
        });

        columns.push(actionsColumn);

        return columns;
    };

    nextEnabled = () => {
        return this.props.date !== null;
    };

    render() {
        return (
            <>
                <Row type="flex" justify="space-between" className="mb-1">
                    <Col>
                        <Button
                            noLeftMargin={true}
                            onClick={() =>
                                this.props.dispatch(
                                    commissionImportPreviousStep()
                                )
                            }
                        >
                            <Icon type="left" />
                            Previous
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            disabled={!this.nextEnabled()}
                            onClick={() => {
                                this.props.dispatch(
                                    updateCommissionImportDate()
                                );
                                this.props.dispatch(
                                    importCommissionClearResults()
                                );
                                this.props.dispatch(commissionImportNextStep());
                            }}
                        >
                            Next
                            <Icon type="right" />
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <h4>Date</h4>

                        <FormItem
                            className="mb-0"
                            validateStatus={
                                this.props.date === null ? 'error' : undefined
                            }
                            help={
                                this.props.date === null
                                    ? 'Please select a commission date'
                                    : ''
                            }
                        >
                            <DatePicker
                                value={
                                    this.props.date
                                        ? moment(this.props.date)
                                        : undefined
                                }
                                onChange={this.selectDate}
                            />
                        </FormItem>
                    </Col>
                </Row>
                <h4 className="mt-1">Commission Data</h4>

                <Table
                    rowKey="_id"
                    columns={this.getColumns()}
                    dataSource={this.props.commissions}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = commissionImportSelector(state);

    return {
        columns: commissionImportSelectedColumnsSelector(state),
        commissions: importState.commissions,
        date: importState.date
    };
};

export default connect(mapStateToProps)(Verify);
