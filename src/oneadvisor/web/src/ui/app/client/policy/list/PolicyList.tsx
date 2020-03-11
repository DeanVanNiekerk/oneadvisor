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
import { policyTypesSelector } from "@/state/app/client/lookups";
import {
    fetchPolicies,
    fetchPolicy,
    newPolicy,
    policiesSelector,
    Policy,
    policyVisible,
    receiveFilters,
    receivePageOptions,
    receiveSortOptions,
} from "@/state/app/client/policies";
import { organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { brokersSelector } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import {
    Button,
    CompanyName,
    getColumnSearchProps,
    getTable,
    Header,
    PolicyTypeName,
    UserName,
} from "@/ui/controls";
import { TagsOutlined } from "@ant-design/icons";

import EditPolicy from "../form/EditPolicy";

const Table = getTable<Policy>();

type Props = {
    clientId?: string;
    onSaved?: () => void;
    hideHeader?: boolean;
    rowSelection?: TableRowSelection<Policy>;
    disabledEdit?: boolean;
} & PropsFromState &
    PropsFromDispatch;

const PolicyList: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        props.fetchPolicies(props.clientId);
    }, [props.pageOptions, props.sortOptions, props.filters, props.clientId]);

    const editPolicy = (id: string) => {
        if (props.disabledEdit) return;
        props.editPolicy(id);
    };

    const onSaved = () => {
        props.fetchPolicies(props.clientId);
        if (props.onSaved) props.onSaved();
    };

    const newPolicy = () => {
        props.newPolicy(props.clientId);
    };

    const renderPolicyNumberCell = (number: string, policy: Policy): React.ReactNode => {
        if (!policy.numberAliases.length) return number;
        return (
            <>
                {number}
                <Popover
                    content={
                        <div>
                            {policy.numberAliases.map(n => (
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
                    filters: props.companies.map(type => ({
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
                    filters: props.policyTypes.map(type => ({
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
                    filters: props.users.map(user => ({
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
            <Header
                hidden={props.hideHeader}
                className="mb-1"
                actions={
                    <>
                        <Button
                            type="default"
                            icon="plus"
                            onClick={newPolicy}
                            disabled={props.fetching}
                            requiredUseCase="clt_edit_policies"
                            visible={!props.disabledEdit}
                        >
                            New Policy
                        </Button>
                    </>
                }
                icon={!props.clientId ? "file-text" : ""}
            >
                {!props.clientId && <span>Policies</span>}
            </Header>
            <Table
                rowKey="id"
                columns={getColumns()}
                dataSource={props.policies}
                loading={props.fetching}
                onRowClick={policy => editPolicy(policy.id)}
                externalDataSource={true}
                pageOptions={props.pageOptions}
                totalRows={props.totalItems}
                onTableChange={onTableChange}
                rowSelection={props.rowSelection}
            />
            <EditPolicy onSaved={onSaved} />
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
        newPolicy: (clientId?: string) => {
            dispatch(newPolicy({ clientId }));
            dispatch(policyVisible(true));
        },
        editPolicy: (policyId: string) => {
            dispatch(fetchPolicy(policyId));
            dispatch(policyVisible(true));
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

export default connect(mapStateToProps, mapDispatchToProps)(PolicyList);
