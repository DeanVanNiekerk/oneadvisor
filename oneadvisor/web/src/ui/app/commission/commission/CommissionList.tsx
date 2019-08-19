import { Col, Row } from "antd";
import { ColumnProps } from "antd/lib/table";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { applyLike } from "@/app/query";
import { Filters, formatBool, getColumnDefinition, PageOptions, SortOptions } from "@/app/table";
import { formatCurrency } from "@/app/utils";
import {
    Commission, CommissionEdit, commissionsSelector, fetchCommission, fetchCommissions, receiveCommission,
    receiveFilters, receivePageOptions, receiveSortOptions
} from "@/state/app/commission/commissions";
import { CommissionType, commissionTypesSelector } from "@/state/app/commission/lookups";
import { organisationCompaniesSelector, Company } from "@/state/app/directory/lookups";
import { brokersSelector, UserSimple } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Button, CommissionTypeName, CompanyName, getTable, Header, UserName } from "@/ui/controls";

import EditCommission from "./EditCommission";

const Table = getTable<Commission>();

type Columns = keyof Commission;

type Props = {
    commissionStatementId?: string;
    commissions: Commission[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    sumAmountIncludingVAT: number;
    sumVAT: number;
    filters: Filters;
    users: UserSimple[];
    commissionTypes: CommissionType[];
    onCommissionsUpdate?: () => void;
    hideHeaderText?: boolean;
    companies: Company[];
    hideColumns?: Columns[];
} & DispatchProp;

class CommissionList extends Component<Props> {
    componentDidMount() {
        this.loadCommissions();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadCommissions();

        if (this.props.commissions.length === 0 && this.props.pageOptions.number !== 1) {
            this.props.dispatch(
                receivePageOptions({
                    ...this.props.pageOptions,
                    number: 1,
                })
            );
        }
    }

    loadCommissions = () => {
        const filters = {
            ...this.props.filters,
            commissionStatementId: [] as string[],
        };

        if (this.props.commissionStatementId) filters.commissionStatementId.push(this.props.commissionStatementId);

        this.props.dispatch(
            fetchCommissions(this.props.pageOptions, this.props.sortOptions, this.updateFilters(filters))
        );
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["policyNumber", "policyClientLastName"]);
    };

    editCommission = (id: string) => {
        this.props.dispatch(fetchCommission(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) {
            this.loadCommissions();
            if (this.props.onCommissionsUpdate) this.props.onCommissionsUpdate();
        }
    };

    newCommission = () => {
        const commission: CommissionEdit = {
            id: "",
            commissionStatementId: this.props.commissionStatementId || "",
            amountIncludingVAT: 0,
            vat: 0,
            commissionTypeId: "",
            policyId: "",
            userId: "",
            splitGroupId: null,
            sourceData: null,
        };
        this.props.dispatch(receiveCommission(commission));
    };

    getColumns = () => {
        var getColumn = getColumnDefinition<Commission>(true, this.props.filters);

        const { hideColumns = [] } = this.props;

        const columns: ColumnProps<Commission>[] = [];

        if (!hideColumns.some(c => c == "commissionStatementDate"))
            columns.push(
                getColumn("commissionStatementDate", "Date", {
                    type: "date",
                })
            );

        if (!hideColumns.some(c => c == "policyClientLastName"))
            columns.push(
                getColumn("policyClientLastName", "Last Name", {
                    showSearchFilter: true,
                })
            );

        if (!hideColumns.some(c => c == "policyClientInitials"))
            columns.push(getColumn("policyClientInitials", "Initials"));

        if (!hideColumns.some(c => c == "policyCompanyId"))
            columns.push(
                getColumn(
                    "policyCompanyId",
                    "Company",
                    {},
                    {
                        render: (policyCompanyId: string) => {
                            return <CompanyName companyId={policyCompanyId} />;
                        },
                        filters: this.props.companies.map(type => ({
                            text: type.name,
                            value: type.id,
                        })),
                    }
                )
            );

        if (!hideColumns.some(c => c == "policyNumber"))
            columns.push(
                getColumn("policyNumber", "Policy Number", {
                    showSearchFilter: true,
                })
            );

        if (!hideColumns.some(c => c == "commissionTypeId"))
            columns.push(
                getColumn(
                    "commissionTypeId",
                    "Type",
                    {},
                    {
                        render: (commissionTypeId: string) => {
                            return <CommissionTypeName commissionTypeId={commissionTypeId} />;
                        },
                        filters: this.props.commissionTypes.map(type => ({
                            text: type.name,
                            value: type.id,
                        })),
                    }
                )
            );

        if (!hideColumns.some(c => c == "amountIncludingVAT"))
            columns.push(
                getColumn("amountIncludingVAT", "Amount (incl VAT)", {
                    type: "currency",
                })
            );

        if (!hideColumns.some(c => c == "vat")) columns.push(getColumn("vat", "VAT", { type: "currency" }));

        if (!hideColumns.some(c => c == "splitGroupId"))
            columns.push(
                getColumn(
                    "splitGroupId",
                    "Split",
                    {},
                    {
                        render: (splitGroupId: string | null) => {
                            return formatBool(!!splitGroupId);
                        },
                    }
                )
            );

        if (!hideColumns.some(c => c == "userId"))
            columns.push(
                getColumn(
                    "userId",
                    "Broker",
                    {},
                    {
                        render: (userId: string) => {
                            return <UserName userId={userId} />;
                        },
                        filters: this.props.users.map(user => ({
                            text: user.fullName,
                            value: user.id,
                        })),
                    }
                )
            );

        return columns;
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (this.props.pageOptions != pageOptions) this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions) this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters) this.props.dispatch(receiveFilters(filters));
    };

    tableFooter = () => {
        return (
            <Row type="flex" justify="space-between">
                <Col>
                    <b>Total Amount (incl VAT): </b>
                    {formatCurrency(this.props.sumAmountIncludingVAT)}
                </Col>
                <Col>
                    <b>Total VAT: </b>
                    {formatCurrency(this.props.sumVAT)}
                </Col>
            </Row>
        );
    };

    render() {
        return (
            <>
                <Header
                    className="mb-1"
                    icon="dollar"
                    textHidden={this.props.hideHeaderText}
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newCommission}
                                disabled={this.props.fetching}
                                requiredUseCase="com_edit_commissions"
                                visible={!!this.props.commissionStatementId}
                            >
                                New Commission
                            </Button>
                        </>
                    }
                >
                    Commission Entries
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.commissions}
                    loading={this.props.fetching}
                    onRowClick={commission => this.editCommission(commission.id)}
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    footer={this.tableFooter}
                    scroll={{
                        x: true,
                    }}
                />
                <EditCommission onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionsState = commissionsSelector(state);
    const commissionTypesState = commissionTypesSelector(state);
    const companiesState = organisationCompaniesSelector(state);

    return {
        commissions: commissionsState.items,
        fetching: commissionsState.fetching,
        pageOptions: commissionsState.pageOptions,
        sortOptions: commissionsState.sortOptions,
        totalItems: commissionsState.totalItems,
        sumAmountIncludingVAT: commissionsState.sumAmountIncludingVAT,
        sumVAT: commissionsState.sumVAT,
        filters: commissionsState.filters,
        users: brokersSelector(state),
        commissionTypes: commissionTypesState.items,
        companies: companiesState,
    };
};

export default connect(mapStateToProps)(CommissionList);
