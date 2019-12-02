import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { getColumnDefinition } from "@/app/table";
import {
    CommissionStatementTemplate,
    commissionStatementTemplatesSelector,
    commissionStatementTemplateVisible,
    fetchCommissionStatementTemplate,
    fetchCommissionStatementTemplates,
    newCommissionStatementTemplate,
} from "@/state/app/commission/templates";
import { organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { RootState } from "@/state/rootReducer";
import { Button, CompanyName, getColumnSearchProps, getTable, Header } from "@/ui/controls";

import EditTemplate from "./EditTemplate";

const Table = getTable<CommissionStatementTemplate>();

type Props = PropsFromState & PropsFromDispatch;

const TemplateList: React.FC<Props> = props => {
    useEffect(() => {
        props.fetchCommissionStatementTemplates();
    }, []);

    return (
        <>
            <Header
                icon="block"
                actions={
                    <Button
                        type="default"
                        icon="plus"
                        onClick={props.newTemplate}
                        disabled={props.fetching}
                    >
                        New Template
                    </Button>
                }
            >
                Commission Statement Templates
            </Header>
            <Table
                rowKey="id"
                columns={getColumns(props)}
                dataSource={props.templates}
                loading={props.fetching}
                onRowClick={org => props.editTemplate(org.id)}
            />
            <EditTemplate
                onSaved={() => {
                    props.fetchCommissionStatementTemplates();
                }}
            />
        </>
    );
};

const getColumns = (props: Props) => {
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
                filters: props.companies.map(type => ({
                    text: type.name,
                    value: type.id,
                })),
            }
        ),
        getColumn("startDate", "Start", { type: "date" }),
        getColumn("endDate", "End", { type: "date" }),
    ];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const templatesState = commissionStatementTemplatesSelector(state);
    const companiesState = organisationCompaniesSelector(state);

    return {
        templates: templatesState.items,
        fetching: templatesState.fetching,
        companies: companiesState,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ fetchCommissionStatementTemplates }, dispatch),
        newTemplate: () => {
            dispatch(newCommissionStatementTemplate());
            dispatch(commissionStatementTemplateVisible(true));
        },
        editTemplate: (templateId: string) => {
            dispatch(fetchCommissionStatementTemplate(templateId));
            dispatch(commissionStatementTemplateVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplateList);
