import { Col, Row } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import { formatCurrency } from '@/app/utils';
import {
    Commission, CommissionEdit, commissionsSelector, fetchCommission, fetchCommissions, receiveCommission,
    receiveFilters, receivePageOptions, receiveSortOptions
} from '@/state/app/commission/commissions';
import { CommissionType, commissionTypesSelector } from '@/state/app/commission/lookups';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Button, CommissionTypeName, CompanyName, Header, Table, UserName } from '@/ui/controls';

import EditCommission from './EditCommission';

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
    }

    loadCommissions = () => {
        const filters = {
            ...this.props.filters,
            commissionStatementId: [] as string[],
        };

        if (this.props.commissionStatementId)
            filters.commissionStatementId.push(
                this.props.commissionStatementId
            );

        this.props.dispatch(
            fetchCommissions(
                this.props.pageOptions,
                this.props.sortOptions,
                filters
            )
        );
    };

    editCommission = (id: string) => {
        this.props.dispatch(fetchCommission(id));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) {
            this.loadCommissions();
            if (this.props.onCommissionsUpdate)
                this.props.onCommissionsUpdate();
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
            sourceData: null,
        };
        this.props.dispatch(receiveCommission(commission));
    };

    getColumns = () => {
        const columns = [] as any[];
        const { hideColumns = [] } = this.props;

        if (!hideColumns.some(c => c == "commissionStatementDate"))
            columns.push(
                getColumnEDS("commissionStatementDate", "Date", {
                    type: "date",
                })
            );

        if (!hideColumns.some(c => c == "policyClientLastName"))
            columns.push(
                getColumnEDS("policyClientLastName", "Last Name", {
                    showSearchFilter: true,
                })
            );

        if (!hideColumns.some(c => c == "policyClientInitials"))
            columns.push(getColumnEDS("policyClientInitials", "Initials"));

        if (!hideColumns.some(c => c == "policyCompanyId"))
            columns.push(
                getColumnEDS(
                    "policyCompanyId",
                    "Company",
                    {
                        render: (policyCompanyId: string) => {
                            return <CompanyName companyId={policyCompanyId} />;
                        },
                        filters: this.props.companies.map(type => ({
                            text: type.name,
                            value: type.id,
                        })),
                    },
                    this.props.filters
                )
            );

        if (!hideColumns.some(c => c == "policyNumber"))
            columns.push(
                getColumnEDS("policyNumber", "Policy Number", {
                    showSearchFilter: true,
                })
            );

        if (!hideColumns.some(c => c == "commissionTypeId"))
            columns.push(
                getColumnEDS("commissionTypeId", "Type", {
                    render: (commissionTypeId: string) => {
                        return (
                            <CommissionTypeName
                                commissionTypeId={commissionTypeId}
                            />
                        );
                    },
                    filters: this.props.commissionTypes.map(type => ({
                        text: type.name,
                        value: type.id,
                    })),
                })
            );

        if (!hideColumns.some(c => c == "amountIncludingVAT"))
            columns.push(
                getColumnEDS("amountIncludingVAT", "Amount (incl VAT)", {
                    type: "currency",
                })
            );

        if (!hideColumns.some(c => c == "vat"))
            columns.push(getColumnEDS("vat", "VAT", { type: "currency" }));

        if (!hideColumns.some(c => c == "userId"))
            columns.push(
                getColumnEDS("userId", "Broker", {
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                    filters: this.props.users.map(user => ({
                        text: user.fullName,
                        value: user.id,
                    })),
                })
            );

        return columns;
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["policyNumber"]);
    };

    onTableChange = (
        pageOptions: PageOptions,
        sortOptions: SortOptions,
        filters: Filters
    ) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters)
            this.props.dispatch(receiveFilters(this.updateFilters(filters)));
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
                    onRowClick={commission =>
                        this.editCommission(commission.id)
                    }
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                    footer={this.tableFooter}
                />
                <EditCommission onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionsState = commissionsSelector(state);
    const usersState = usersSimpleSelector(state);
    const commissionTypesState = commissionTypesSelector(state);
    const companiesState = companiesSelector(state);

    return {
        commissions: commissionsState.items,
        fetching: commissionsState.fetching,
        pageOptions: commissionsState.pageOptions,
        sortOptions: commissionsState.sortOptions,
        totalItems: commissionsState.totalItems,
        sumAmountIncludingVAT: commissionsState.sumAmountIncludingVAT,
        sumVAT: commissionsState.sumVAT,
        filters: commissionsState.filters,
        users: usersState.items,
        commissionTypes: commissionTypesState.items,
        companies: companiesState.items,
    };
};

export default connect(mapStateToProps)(CommissionList);
