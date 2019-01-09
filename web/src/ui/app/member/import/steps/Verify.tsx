import { Col, Form, Popconfirm, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { filterOption } from '@/app/controls/select';
import { getColumn } from '@/app/table';
import { companiesSelector, Company, fetchCompanies } from '@/state/app/directory/lookups/companies';
import {
    ImportColumn, ImportMember, memberImportNextStep, memberImportPreviousStep, memberImportSelector,
    receiveMemberImportPolicyCompany, removeMemberImportMember, updateMemberImportPolicyCompanies
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button, Table } from '@/ui/controls';

const FormItem = Form.Item;
const Option = Select.Option;

type Props = {
    columns: ImportColumn[];
    members: ImportMember[];
    companies: Company[];
    selectedCompanyId: string;
    loading: boolean;
} & DispatchProp;

class Verify extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns
        };
    }

    componentDidMount() {
        if (this.props.companies.length === 0)
            this.props.dispatch(fetchCompanies());
    }

    removeImportMember = (id: string) => {
        this.props.dispatch(removeMemberImportMember(id));
    };

    selectCompany = (companyId: string) => {
        this.props.dispatch(receiveMemberImportPolicyCompany(companyId));
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
            render: (value: any, record: ImportMember) => {
                return (
                    <Popconfirm
                        title="Are you sure remove this record?"
                        onConfirm={() => this.removeImportMember(record._id)}
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
        return this.props.selectedCompanyId !== null;
    };

    render() {
        return (
            <>
                <Row>
                    <Col span={6}>
                        <h4>Policy Company</h4>

                        <FormItem
                            className="mb-0"
                            validateStatus={
                                this.props.selectedCompanyId === null
                                    ? 'error'
                                    : undefined
                            }
                            help={
                                this.props.selectedCompanyId === null
                                    ? 'Please select a policy company'
                                    : ''
                            }
                        >
                            <Select
                                loading={this.props.loading}
                                showSearch={true}
                                style={{ width: '100%' }}
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

                <h4 className="mt-1">Member Data</h4>

                <Table
                    rowKey="_id"
                    columns={this.getColumns()}
                    dataSource={this.props.members}
                />

                <Row type="flex" justify="end" className="mt-1">
                    <Col>
                        <Button
                            onClick={() =>
                                this.props.dispatch(memberImportPreviousStep())
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            type="primary"
                            disabled={!this.nextEnabled()}
                            onClick={() => {
                                this.props.dispatch(
                                    updateMemberImportPolicyCompanies()
                                );
                                this.props.dispatch(memberImportNextStep());
                            }}
                        >
                            Next
                        </Button>
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);
    const companiesState = companiesSelector(state);

    return {
        columns: importState.columns,
        members: importState.members,
        companies: companiesState.items,
        selectedCompanyId: importState.companyId,
        loading: companiesState.fetching
    };
};

export default connect(mapStateToProps)(Verify);
