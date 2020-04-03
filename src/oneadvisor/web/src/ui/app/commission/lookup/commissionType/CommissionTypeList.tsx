import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { PolicyType, policyTypesSelector } from "@/state/client/lookups";
import {
    CommissionEarningsType,
    commissionEarningsTypesSelector,
} from "@/state/commission/lookups";
import {
    CommissionType,
    CommissionTypeEdit,
    commissionTypesSelector,
    fetchCommissionTypes,
    receiveCommissionType,
} from "@/state/commission/lookups/commissionTypes";
import { RootState } from "@/state/rootReducer";
import {
    Button,
    CommissionEarningsTypeName,
    getColumnSearchProps,
    getTable,
    Header,
    PolicyTypeName,
} from "@/ui/controls";

import EditCommissionType from "./EditCommissionType";

const Table = getTable<CommissionType>();

type Props = {
    commissionTypes: CommissionType[];
    fetching: boolean;
    commissionEarningsTypes: CommissionEarningsType[];
    policyTypes: PolicyType[];
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class CommissionTypeList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.commissionTypes.length === 0) this.loadCommissionTypes();
    }

    loadCommissionTypes = () => {
        this.props.dispatch(fetchCommissionTypes());
    };

    newCommissionType = () => {
        const commissionType: CommissionTypeEdit = {
            id: null,
            policyTypeId: "",
            commissionEarningsTypeId: "",
            name: "",
            code: "",
        };
        this.showEditCommissionType(commissionType);
    };

    editCommissionType = (id: string) => {
        const commissionType = this.props.commissionTypes.find((u) => u.id === id);
        if (commissionType) this.showEditCommissionType(commissionType);
    };

    showEditCommissionType = (commissionType: CommissionTypeEdit) => {
        this.props.dispatch(receiveCommissionType(commissionType));
        this.setState({
            editVisible: true,
        });
    };

    closeEditCommissionType = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadCommissionTypes();
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<CommissionType>();
        return [
            getColumn("name", "Name", {}, getColumnSearchProps("Name")),
            getColumn("code", "Code", {}, getColumnSearchProps("Code")),
            getColumn(
                "policyTypeId",
                "Policy Type",
                {},
                {
                    render: (policyTypeId: string) => {
                        return <PolicyTypeName policyTypeId={policyTypeId} />;
                    },
                    filters: this.props.policyTypes.map((p) => ({
                        text: p.name,
                        value: p.id,
                    })),
                }
            ),
            getColumn(
                "commissionEarningsTypeId",
                "Earnings Type",
                {},
                {
                    render: (commissionEarningsTypeId: string) => {
                        return (
                            <CommissionEarningsTypeName
                                commissionEarningsTypeId={commissionEarningsTypeId}
                            />
                        );
                    },
                    filters: this.props.commissionEarningsTypes.map((c) => ({
                        text: c.name,
                        value: c.id,
                    })),
                }
            ),
        ];
    };

    render() {
        return (
            <>
                <Header
                    iconName="database"
                    actions={
                        <Button
                            type="default"
                            iconName="plus"
                            onClick={this.newCommissionType}
                            disabled={this.props.fetching}
                        >
                            New Commission Type
                        </Button>
                    }
                >
                    Commission Types
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.commissionTypes}
                    loading={this.props.fetching}
                    onRowClick={(org) => this.editCommissionType(org.id)}
                />
                <EditCommissionType
                    visible={this.state.editVisible}
                    onClose={this.closeEditCommissionType}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionTypesState = commissionTypesSelector(state);
    const commissionEarningsTypesState = commissionEarningsTypesSelector(state);
    const policyTypesState = policyTypesSelector(state);

    return {
        commissionTypes: commissionTypesState.items,
        policyTypes: policyTypesState.items,
        commissionEarningsTypes: commissionEarningsTypesState.items,
        fetching: commissionTypesState.fetching,
    };
};

export default connect(mapStateToProps)(CommissionTypeList);
