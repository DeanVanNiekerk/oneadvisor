import { Col, Form, Icon, Popconfirm, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { filterOption } from '@/app/controls/select';
import { getColumn } from '@/app/table';
import { companiesSelector, Company, fetchCompanies } from '@/state/app/directory/lookups/companies';
import {
    ImportClient, ImportColumn, importClientClearResults, clientImportNextStep, clientImportPreviousStep,
    clientImportSelectedColumnsSelector, clientImportSelector, receiveClientImportPolicyCompany,
    removeClientImportClient, updateClientImportPolicyCompanies
} from '@/state/app/client/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

import StepProgress from '../StepProgress';

const FormItem = Form.Item;
const Option = Select.Option;

type Props = {
    columns: ImportColumn[];
    clients: ImportClient[];
    companies: Company[];
    selectedCompanyId: string;
    loading: boolean;
} & DispatchProp;

class Verify extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns,
        };
    }

    componentDidMount() {
        if (this.props.companies.length === 0)
            this.props.dispatch(fetchCompanies());
    }

    removeImportClient = (id: string) => {
        this.props.dispatch(removeClientImportClient(id));
    };

    selectCompany = (companyId: string) => {
        this.props.dispatch(receiveClientImportPolicyCompany(companyId));
    };

    getColumns = () => {
        const columns = this.props.columns.map(c =>
            getColumn(c.id, c.name, {
                showSearchFilter: true,
                sorter: undefined,
            })
        );

        const actionsColumn = getColumn("actions", "Actions", {
            sorter: undefined,
            fixed: "right",
            render: (value: any, record: ImportClient) => {
                return (
                    <Popconfirm
                        title="Are you sure remove this record?"
                        onConfirm={() => this.removeImportClient(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href="#">Remove</a>
                    </Popconfirm>
                );
            },
        });

        columns.push(actionsColumn);

        return columns;
    };

    nextEnabled = () => {
        if (this.policyCompanyRequired())
            return this.props.selectedCompanyId !== null;
        return true;
    };

    policyCompanyRequired = () => {
        return this.props.columns.some(c => c.id === "policyNumber");
    };

    render() {
        return (
            <>
                <StepProgress
                    onPrevious={() =>
                        this.props.dispatch(clientImportPreviousStep())
                    }
                    nextDisabled={!this.nextEnabled()}
                    onNext={() => {
                        this.props.dispatch(
                            updateClientImportPolicyCompanies()
                        );
                        this.props.dispatch(importClientClearResults());
                        this.props.dispatch(clientImportNextStep());
                    }}
                />

                {this.policyCompanyRequired() && (
                    <Row>
                        <Col span={6}>
                            <h4>Policy Company</h4>

                            <FormItem
                                className="mb-0"
                                validateStatus={
                                    this.props.selectedCompanyId === null
                                        ? "error"
                                        : undefined
                                }
                                help={
                                    this.props.selectedCompanyId === null
                                        ? "Please select a policy company"
                                        : ""
                                }
                            >
                                <Select
                                    loading={this.props.loading}
                                    showSearch={true}
                                    style={{ width: "100%" }}
                                    filterOption={filterOption}
                                    onChange={(value: string) =>
                                        this.selectCompany(value)
                                    }
                                    value={this.props.selectedCompanyId}
                                >
                                    {this.props.companies.map(c => (
                                        <Option key={c.id} value={c.id}>
                                            {c.name}
                                        </Option>
                                    ))}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                )}
                <h4 className="mt-1">Client Data</h4>

                <Table
                    rowKey="_id"
                    columns={this.getColumns()}
                    dataSource={this.props.clients}
                    scroll={{
                        x: true,
                    }}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = clientImportSelector(state);
    const companiesState = companiesSelector(state);

    return {
        columns: clientImportSelectedColumnsSelector(state),
        clients: importState.clients,
        companies: companiesState.items,
        selectedCompanyId: importState.companyId,
        loading: companiesState.fetching,
    };
};

export default connect(mapStateToProps)(Verify);