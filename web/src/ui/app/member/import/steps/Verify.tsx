import { Col, Popconfirm, Row, Select } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { filterOption } from '@/app/controls/select';
import { getColumn } from '@/app/table';
import { companiesSelector, Company, fetchCompanies } from '@/state/app/directory/lookups/companies';
import {
    ImportColumn, ImportMember, memberImportSelector, receiveMemberImportPolicyCompany, removeMemberImportMember
} from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Table } from '@/ui/controls';

const Option = Select.Option;

type Props = {
    columns: ImportColumn[];
    members: ImportMember[];
    companies: Company[];
    selectedCompanyId: string;
    loading: boolean;
} & DispatchProp;

class Configure extends Component<Props> {
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

    render() {
        return (
            <>
                <Row>
                    <Col span={6}>
                        <h4>Policy Company</h4>

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
                                <Option value={c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                <h4 className="mt-1">Member Data</h4>

                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.members}
                />
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

export default connect(mapStateToProps)(Configure);
