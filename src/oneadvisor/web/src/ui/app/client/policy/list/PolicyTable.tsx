import { Popover } from "antd";
import { TableRowSelection } from "antd/lib/table/interface";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    Filters,
    getBooleanOptions,
    getColumnDefinition,
    PageOptions,
    SortOptions,
} from "@/app/table";
import { areEqual } from "@/app/utils";
import { RootState } from "@/state";
import {
    fetchPolicies,
    policiesSelector,
    Policy,
    receiveFilters,
    receivePageOptions,
    receiveSortOptions,
} from "@/state/client/policies";
import { policyTypesSelector } from "@/state/lookups/client";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { brokersSelector } from "@/state/lookups/directory/usersSimple";
import {
    CompanyName,
    getColumnSearchProps,
    getTable,
    PolicyTypeName,
    UserName,
} from "@/ui/controls";
import { TagsOutlined } from "@ant-design/icons";

const Table = getTable<Policy>();

type Props = {
    clientId?: string;
    rowSelection?: TableRowSelection<Policy>;
    onPolicyClicked?: (policyId: string) => void;
} & PropsFromState &
    PropsFromDispatch;

const PolicyTable: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchPolicies(props.clientId);
    }, [props.pageOptions, props.sortOptions, props.filters, props.clientId]);

    const renderPolicyNumberCell = (number: string, policy: Policy): React.ReactNode => {
        if (!policy.numberAliases.length) return number;
        return (
            <>
                {number}
                <Popover
                    content={
                        <div>
                            {policy.numberAliases.map((n) => (
                                <div key={n} style={{ marginBottom: "5px" }}>
                                    {n}
                                </div>
                            ))}
                        </div>
                    }
                    title="Aliases"
                >
                    <TagsOutlined style={{ marginLeft: "5px" }} />
                </Popover>
            </>
        );
    };

    const getColumns = () => {
        const getColumn = getColumnDefinition<Policy>(true, props.filters, props.sortOptions);

        const columns = [
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                    filters: props.companies.map((type) => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
            getColumn(
                "number",
                "Number",
                {},
                {
                    render: renderPolicyNumberCell,
                    ...getColumnSearchProps("Number"),
                }
            ),
            getColumn(
                "policyTypeId",
                "Type",
                {},
                {
                    render: (policyTypeId: string) => {
                        return <PolicyTypeName policyTypeId={policyTypeId} />;
                    },
                    filters: props.policyTypes.map((type) => ({
                        text: type.name,
                        value: type.id,
                    })),
                }
            ),
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
            ),
            getColumn(
                "isActive",
                "Active",
                {
                    type: "boolean",
                },
                {
                    filters: getBooleanOptions(),
                }
            ),
        ];

        if (!props.clientId) {
            columns.splice(
                3,
                0,
                getColumn("clientLastName", "Last Name", {}, getColumnSearchProps("Last Name")),
                getColumn("clientInitials", "Initials"),
                getColumn("clientDateOfBirth", "Date of Birth", {
                    type: "date",
                })
            );
        }

        return columns;
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
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.policies}
                loading={props.fetching}
                onRowClick={(policy) => {
                    if (props.onPolicyClicked) props.onPolicyClicked(policy.id);
                }}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
                rowSelection={props.rowSelection}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policiesState = policiesSelector(state);
    const companiesState = organisationCompaniesSelector(state);
    const policyTypesState = policyTypesSelector(state);

    return {
        policies: policiesState.items,
        fetching: policiesState.fetching,
        pageOptions: policiesState.pageOptions,
        sortOptions: policiesState.sortOptions,
        totalItems: policiesState.totalItems,
        filters: policiesState.filters,
        companies: companiesState,
        policyTypes: policyTypesState.items,
        users: brokersSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        fetchPolicies: (clientId?: string) => {
            dispatch(fetchPolicies(clientId));
        },
        updatePageOptions: (pageOptions: PageOptions) => {
            dispatch(receivePageOptions(pageOptions));
        },
        updateSortOptions: (sortOptions: SortOptions) => {
            dispatch(receiveSortOptions(sortOptions));
        },
        updateFilters: (filters: Filters) => {
            dispatch(receiveFilters(filters));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyTable);
