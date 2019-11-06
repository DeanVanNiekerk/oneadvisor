import { Alert, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { Filters, getColumnDefinition, PageOptions, sort, SortOptions } from "@/app/table";
import { areEqual } from "@/app/utils";
import { AuditLog, auditLogsSelector, fetchAuditLogs, receiveFilters } from "@/state/app/directory/audit";
import { usersSimpleSelector } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { getDateRangeSearchProps, getTable, Header, UserName } from "@/ui/controls";

import AuditLogDetails from "./AuditLogDetails";

const Table = getTable<AuditLog>();

type Props = PropsFromState & PropsFromDispatch;

const AuditLogList: React.FC<Props> = props => {
    const [auditLog, setAuditLog] = useState<AuditLog | null>(null);

    useEffect(() => {
        props.fetchAuditLogs();
    }, [props.filters]);

    const onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions, filters: Filters) => {
        if (!areEqual(props.filters, filters)) props.updateFilters(filters);
    };

    return (
        <>
            <Header icon="video-camera">Audit Logs</Header>

            {props.limitReached && (
                <Alert
                    message="The audit logs are currently truncated, please refine your search."
                    type="warning"
                    className="mb-1"
                />
            )}

            <Table
                rowKey="id"
                columns={getColumns(props)}
                dataSource={props.logs}
                loading={props.fetching}
                onRowClick={auditLog => setAuditLog(auditLog)}
                onTableChange={onTableChange}
            />
            <AuditLogDetails visible={auditLog !== null} onClose={() => setAuditLog(null)} auditLog={auditLog} />
        </>
    );
};

const getColumns = (props: Props) => {
    var getColumn = getColumnDefinition<AuditLog>(false, props.filters);

    var dateRangeFilter = getDateRangeSearchProps<AuditLog>("date");

    return [
        getColumn(
            "date",
            "Date",
            { type: "long-date" },
            {
                ...dateRangeFilter,
                sorter: (a, b) => sort(a, b, "date"),
                onFilter: undefined,
            }
        ),
        getColumn(
            "entity",
            "Entity",
            { showSearchFilter: true },
            {
                sorter: (a, b) => sort(a, b, "entity"),
                onFilter: undefined,
                render: (entity: string) => {
                    return entity.replace("Entity", "");
                },
            }
        ),
        getColumn(
            "action",
            "Action",
            {},
            {
                sorter: (a, b) => sort(a, b, "action"),
                onFilter: undefined,
                render: (action: string) => {
                    action = action.toUpperCase();
                    switch (action) {
                        case "DELETE":
                            return <Tag color="red">{action}</Tag>;
                        case "INSERT":
                            return <Tag color="green">{action}</Tag>;
                        case "UPDATE":
                            return <Tag color="orange">{action}</Tag>;
                        default:
                            return <Tag color="blue">{action}</Tag>;
                    }
                },
                filters: [
                    {
                        text: "Insert",
                        value: "Insert",
                    },
                    {
                        text: "Update",
                        value: "Update",
                    },
                    {
                        text: "Delete",
                        value: "Delete",
                    },
                    {
                        text: "Authenticate",
                        value: "Authenticate",
                    },
                ],
            }
        ),
        getColumn(
            "userId",
            "Broker",
            {},
            {
                sorter: false,
                onFilter: undefined,
                render: (userId: string | null) => {
                    return <UserName userId={userId} />;
                },
                filters: props.users.map(user => ({
                    text: user.fullName,
                    value: user.id,
                })),
            }
        ),
    ];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const auditLogsState = auditLogsSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        logs: auditLogsState.items,
        limit: auditLogsState.limit,
        limitReached: auditLogsState.limitReached,
        fetching: auditLogsState.fetching,
        filters: auditLogsState.filters,
        users: usersState.items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ fetchAuditLogs }, dispatch),
        updateFilters: (filters: Filters) => {
            dispatch(receiveFilters(filters));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuditLogList);
