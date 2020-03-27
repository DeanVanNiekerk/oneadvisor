import { Input } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { applyLike } from "@/app/query";
import { getColumnDefinition } from "@/app/table";
import { Policy, policySearchSelector, searchPolicies } from "@/state/app/client/policies";
import { RootState } from "@/state/rootReducer";
import { CompanyName, getTable, PolicyTypeName, UserName } from "@/ui/controls";
import { SearchOutlined } from "@ant-design/icons";

const Table = getTable<Policy>();

type Props = {
    policies: Policy[];
    clientId?: string | null;
    companyId?: string | null;
    fetching: boolean;
    onSelect: (policyId: string) => void;
} & DispatchProp;

type State = {
    searchText: string;
};

class PolicySearch extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
        };
    }

    componentDidMount() {
        this.loadPolicys();
    }

    loadPolicys = () => {
        const filters = {
            lastName: [this.state.searchText],
            clientId: [] as string[],
            companyId: [] as string[],
        };

        if (this.props.clientId) filters.clientId.push(this.props.clientId);

        if (this.props.companyId) filters.companyId.push(this.props.companyId);

        this.props.dispatch(searchPolicies(applyLike(filters, ["number"])));
    };

    selectPolicy = (id: string) => {
        this.props.onSelect(id);
    };

    onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: e.target.value }, this.loadPolicys);
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<Policy>();
        return [
            getColumn(
                "policyTypeId",
                "Type",
                {},
                {
                    sorter: false,
                    render: (policyTypeId: string) => {
                        return <PolicyTypeName policyTypeId={policyTypeId} />;
                    },
                }
            ),
            getColumn("number", "Number", {}, { sorter: false }),
            getColumn(
                "premium",
                "Premium",
                { type: "currency" },
                {
                    sorter: false,
                }
            ),
            getColumn(
                "companyId",
                "Company",
                {},
                {
                    sorter: false,
                    render: (companyId: string) => {
                        return <CompanyName companyId={companyId} />;
                    },
                }
            ),
            getColumn(
                "userId",
                "Broker",
                {},
                {
                    sorter: false,
                    render: (userId: string) => {
                        return <UserName userId={userId} />;
                    },
                }
            ),
            getColumn(
                "isActive",
                "Active",
                {
                    type: "boolean",
                },
                {
                    sorter: false,
                }
            ),
        ];
    };

    render() {
        const { searchText } = this.state;

        return (
            <>
                <Input
                    autoFocus={true}
                    size="large"
                    placeholder="Policy Number"
                    prefix={<SearchOutlined />}
                    allowClear={true}
                    value={searchText}
                    onChange={this.onSearchChange}
                    className="mb-1"
                />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.policies}
                    loading={this.props.fetching}
                    onRowClick={(policy) => this.selectPolicy(policy.id)}
                    hidePagination={true}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policysState = policySearchSelector(state);

    return {
        policies: policysState.items,
        fetching: policysState.fetching,
    };
};

export default connect(mapStateToProps)(PolicySearch);
