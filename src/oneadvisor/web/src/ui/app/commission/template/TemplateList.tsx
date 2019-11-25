import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { UNKNOWN_COMMISSION_TYPE_CODE } from "@/state/app/commission/lookups";
import {
    CommissionStatementTemplate,
    CommissionStatementTemplateEdit,
    commissionStatementTemplatesSelector,
    fetchCommissionStatementTemplate,
    fetchCommissionStatementTemplates,
    receiveCommissionStatementTemplate,
} from "@/state/app/commission/templates";
import { Company, organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Button, CompanyName, getColumnSearchProps, getTable, Header } from "@/ui/controls";

import EditTemplate from "./EditTemplate";

const Table = getTable<CommissionStatementTemplate>();

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
        this.loadTemplates();
    }

    loadTemplates = () => {
        this.props.dispatch(fetchCommissionStatementTemplates({}));
    };

    newTemplate = () => {
        const template: CommissionStatementTemplateEdit = {
            id: "",
            name: "",
            companyId: "",
            startDate: "",
            endDate: "",
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
                            groups: [],
                        },
                    },
                ],
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

    closeEditCompany = () => {
        this.setState({
            editVisible: false,
        });
        this.loadTemplates();
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<CommissionStatementTemplate>();
        return [
            getColumn("name", "Name", {}, getColumnSearchProps("Name")),
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: this.props.companies.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn("startDate", "Start", { type: "date" }),
            getColumn("endDate", "End", { type: "date" }),
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
                <EditTemplate visible={this.state.editVisible} onClose={this.closeEditCompany} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);
    const companiesState = organisationCompaniesSelector(state);

    return {
        templates: templatesState.items,
        fetching: templatesState.fetching,
        companies: companiesState,
    };
};

export default connect(mapStateToProps)(TemplateList);