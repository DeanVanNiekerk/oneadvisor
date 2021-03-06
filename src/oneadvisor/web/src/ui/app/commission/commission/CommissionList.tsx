import { Col, Row } from "antd";
import { ColumnProps } from "antd/lib/table";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import {
    Filters,
    formatBool,
    getColumnDefinition,
    hasFilters,
    PageOptions,
    sort,
    SortOptions,
} from "@/app/table";
import { areEqual, formatCurrency } from "@/app/utils";
import { RootState } from "@/state";
import {
    Commission,
    commissionsSelector,
    commissionVisible,
    fetchCommission,
    fetchCommissions,
    receiveFilters,
    receivePageOptions,
    receiveSortOptions,
} from "@/state/commission/commissions";
import { commissionTypesSelector } from "@/state/commission/lookups";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { brokersSelector } from "@/state/lookups/directory/usersSimple";
import {
    Button,
    CommissionTypeName,
    CompanyName,
    getColumnSearchProps,
    getDateRangeSearchProps,
    getTable,
    Header,
    UserName,
} from "@/ui/controls";

import EditCommission from "./EditCommission";

const Table = getTable<Commission>();

type Columns = keyof Commission;

type Props = {
    commissionStatementId?: string;
    onSaved?: () => void;
    hideHeader?: boolean;
    hideColumns?: Columns[];
} & PropsFromState &
    PropsFromDispatch;

const CommissionList: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchCommissions(props.commissionStatementId);
    }, [props.pageOptions, props.sortOptions, props.filters, props.commissionStatementId]);

    useEffect(() => {
        //If we are NOT on the first page and there are no errors, move to first page
        if (props.pageOptions.number !== 1 && props.commissions.length === 0) {
            props.updatePageOptions({
                ...props.pageOptions,
                number: props.pageOptions.number - 1,
            });
        }
    }, [props.commissions]);

    const editCommission = (id: string) => {
        props.editCommission(id);
    };

    const onSaved = () => {
        props.fetchCommissions(props.commissionStatementId);
        if (props.onSaved) props.onSaved();
    };

    const onTableChange = (
        pageOptions: PageOptions,
        sortOptions: SortOptions,
        filters: Filters
    ) => {
        if (!areEqual(props.pageOptions, pageOptions)) props.updatePageOptions(pageOptions);
        if (!areEqual(props.sortOptions, sortOptions)) props.updateSortOptions(sortOptions);
        if (!areEqual(props.filters, filters)) props.updateFilters(filters);
    };

    return (
        <>
            <Header
                className="mb-1"
                iconName="dollar"
                actions={
                    <>
                        <Button
                            danger={true}
                            iconName="filter"
                            onClick={() => props.updateFilters({})}
                            visible={hasFilters(props.filters)}
                        >
                            Clear Filters
                        </Button>
                    </>
                }
                hidden={props.hideHeader}
            >
                Commission Entries
            </Header>
            <Table
                rowKey="id"
                columns={getColumns(props)}
                dataSource={props.commissions}
                loading={props.fetching}
                onRowClick={(commission) => editCommission(commission.id)}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
                footer={() => <TableFooter {...props} />}
                scroll={{
                    x: "max-content",
                }}
            />
            <EditCommission onSaved={onSaved} />
        </>
    );
};

const getColumns = (props: Props) => {
    const getColumn = getColumnDefinition<Commission>(true, props.filters, props.sortOptions);

    const dateRangeFilter = getDateRangeSearchProps<Commission>("month");

    const { hideColumns = [] } = props;

    const columns: ColumnProps<Commission>[] = [];

    if (!hideColumns.some((c) => c == "commissionStatementDate"))
        columns.push(
            getColumn(
                "commissionStatementDate",
                "Date",
                {
                    type: "date",
                },
                {
                    ...dateRangeFilter,
                    sorter: (a, b) => sort(a, b, "commissionStatementDate"),
                    onFilter: undefined,
                }
            )
        );

    if (!hideColumns.some((c) => c == "policyClientLastName"))
        columns.push(
            getColumn("policyClientLastName", "Last Name", {}, getColumnSearchProps("Last Name"))
        );

    if (!hideColumns.some((c) => c == "policyClientInitials"))
        columns.push(getColumn("policyClientInitials", "Initials"));

    if (!hideColumns.some((c) => c == "policyCompanyId"))
        columns.push(
            getColumn(
                "policyCompanyId",
                "Company",
                {},
                {
                    render: (policyCompanyId: string) => {
                        return <CompanyName companyId={policyCompanyId} />;
                    },
                    filters: props.companies.map((c) => ({
                        text: c.name,
                        value: c.id,
                    })),
                }
            )
        );

    if (!hideColumns.some((c) => c == "policyNumber"))
        columns.push(
            getColumn("policyNumber", "Policy Number", {}, getColumnSearchProps("Policy Number"))
        );

    if (!hideColumns.some((c) => c == "commissionTypeId"))
        columns.push(
            getColumn(
                "commissionTypeId",
                "Type",
                {},
                {
                    render: (commissionTypeId: string) => {
                        return <CommissionTypeName commissionTypeId={commissionTypeId} />;
                    },
                    filters: props.commissionTypes.map((type) => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            )
        );

    if (!hideColumns.some((c) => c == "amountIncludingVAT"))
        columns.push(
            getColumn("amountIncludingVAT", "Amount (incl VAT)", {
                type: "long-currency",
            })
        );

    if (!hideColumns.some((c) => c == "vat"))
        columns.push(getColumn("vat", "VAT", { type: "long-currency" }));

    if (!hideColumns.some((c) => c == "splitGroupId"))
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

    if (!hideColumns.some((c) => c == "userId"))
        columns.push(
            getColumn(
                "userId",
                "Broker",
                {},
                {
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                    filters: props.users.map((user) => ({
                        text: user.fullName,
                        value: user.id,
                    })),
                }
            )
        );

    return columns;
};

const TableFooter: React.FC<Props> = (props: Props) => {
    return (
        <Row justify="space-between">
            <Col>
                <b>Total Amount (incl VAT): </b>
                {formatCurrency(props.sumAmountIncludingVAT)}
            </Col>
            <Col>
                <b>Total VAT: </b>
                {formatCurrency(props.sumVAT)}
            </Col>
        </Row>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
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

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ fetchCommissions }, dispatch),
        updatePageOptions: (pageOptions: PageOptions) => {
            dispatch(receivePageOptions(pageOptions));
        },
        updateSortOptions: (sortOptions: SortOptions) => {
            dispatch(receiveSortOptions(sortOptions));
        },
        updateFilters: (filters: Filters) => {
            dispatch(receiveFilters(filters));
        },
        editCommission: (commissionId: string) => {
            dispatch(fetchCommission(commissionId));
            dispatch(commissionVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommissionList);
