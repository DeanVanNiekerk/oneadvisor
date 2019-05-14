import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import { UNKNOWN_COMMISSION_TYPE_CODE } from '@/state/app/commission/lookups';
import {
    CommissionStatementTemplate, CommissionStatementTemplateEdit, commissionStatementTemplatesSelector,
    fetchCommissionStatementTemplate, fetchCommissionStatementTemplates, receiveCommissionStatementTemplate
} from '@/state/app/commission/templates';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Button, CompanyName, Header, Table } from '@/ui/controls';

import EditTemplate from './EditTemplate';

type Props = {
    templates: CommissionStatementTemplate[];
    fetching: boolean;
    companies: Company[];
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class TemplateList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.templates.length === 0) this.loadTemplates();
    }

    loadTemplates = () => {
        this.props.dispatch(fetchCommissionStatementTemplates());
    };

    newTemplate = () => {
        const template: CommissionStatementTemplateEdit = {
            id: "",
            name: "",
            companyId: "",
            config: {
                sheets: [
                    {
                        position: 1,
                        config: {
                            headerIdentifier: {
                                column: "",
                                value: "",
                            },
                            fields: [],
                            commissionTypes: {
                                defaultCommissionTypeCode: UNKNOWN_COMMISSION_TYPE_CODE,
                                mappingTemplate: "",
                                types: [],
                            },
                        }
                    }
                ]
            },
        };
        this.props.dispatch(receiveCommissionStatementTemplate(template));
        this.showEditTemplate();
    };

    editTemplate = (id: string) => {
        this.props.dispatch(fetchCommissionStatementTemplate(id));
        this.showEditTemplate();
    };

    showEditTemplate = () => {
        this.setState({
            editVisible: true,
        });
    };

    closeEditCompany = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadTemplates();
    };

    getColumns = () => {
        return [
            getColumn("name", "Name", { showSearchFilter: true }),
            getColumn("companyId", "Company", {
                render: (companyId: string) => {
                    return <CompanyName companyId={companyId} />;
                },
                filters: this.props.companies.map(type => ({
                    text: type.name,
                    value: type.id,
                })),
            }),
        ];
    };

    render() {
        return (
            <>
                <Header
                    icon="block"
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newTemplate}
                            disabled={this.props.fetching}
                            requiredUseCase="com_edit_commission_statement_templates"
                        >
                            New Template
                        </Button>
                    }
                >
                    Commission Statement Templates
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.templates}
                    loading={this.props.fetching}
                    onRowClick={org => this.editTemplate(org.id)}
                />
                <EditTemplate
                    visible={this.state.editVisible}
                    onClose={this.closeEditCompany}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);
    const companiesState = companiesSelector(state);

    return {
        templates: templatesState.items,
        fetching: templatesState.fetching,
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(TemplateList);
