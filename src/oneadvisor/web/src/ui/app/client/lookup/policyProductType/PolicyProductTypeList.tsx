import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    fetchPolicyProductTypes,
    policyProductTypesSelector,
    policyTypesSelector,
    receivePolicyProductType,
} from "@/state/lookups/client";
import {
    PolicyProductType,
    PolicyProductTypeEdit,
} from "@/state/lookups/client/policyProductTypes/types";
import { PolicyType } from "@/state/lookups/client/policyTypes/types";
import { Button, getColumnSearchProps, getTable, Header, PolicyTypeName } from "@/ui/controls";

import EditPolicyProductType from "./EditPolicyProductType";

const Table = getTable<PolicyProductType>();

type Props = {
    policyProductTypes: PolicyProductType[];
    fetching: boolean;
    policyTypes: PolicyType[];
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class PolicyProductTypeList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.policyProductTypes.length === 0) this.loadPolicyProductTypes();
    }

    loadPolicyProductTypes = () => {
        this.props.dispatch(fetchPolicyProductTypes());
    };

    newPolicyProductType = () => {
        const policyProductType: PolicyProductTypeEdit = {
            id: null,
            policyTypeId: "",
            name: "",
            code: "",
            policyTypeCharacteristics: [],
        };
        this.showEditPolicyProductType(policyProductType);
    };

    editPolicyProductType = (id: string) => {
        const policyProductType = this.props.policyProductTypes.find((u) => u.id === id);
        if (policyProductType) this.showEditPolicyProductType(policyProductType);
    };

    showEditPolicyProductType = (policyProductType: PolicyProductTypeEdit) => {
        this.props.dispatch(receivePolicyProductType(policyProductType));
        this.setState({
            editVisible: true,
        });
    };

    closeEditPolicyProductType = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadPolicyProductTypes();
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<PolicyProductType>();
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
                            onClick={this.newPolicyProductType}
                            disabled={this.props.fetching}
                        >
                            New Policy Product Type
                        </Button>
                    }
                >
                    Policy Product Types
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.policyProductTypes}
                    loading={this.props.fetching}
                    onRowClick={(t) => this.editPolicyProductType(t.id)}
                />
                <EditPolicyProductType
                    visible={this.state.editVisible}
                    onClose={this.closeEditPolicyProductType}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyProductTypesState = policyProductTypesSelector(state);
    const policyTypesState = policyTypesSelector(state);

    return {
        policyProductTypes: policyProductTypesState.items,
        policyTypes: policyTypesState.items,
        fetching: policyProductTypesState.fetching,
    };
};

export default connect(mapStateToProps)(PolicyProductTypeList);
