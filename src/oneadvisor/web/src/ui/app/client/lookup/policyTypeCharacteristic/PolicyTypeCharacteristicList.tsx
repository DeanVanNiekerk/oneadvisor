import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    fetchPolicyTypeCharacteristics,
    newPolicyTypeCharacteristic,
    policyTypeCharacteristicsSelector,
    policyTypeCharacteristicVisible,
    policyTypesSelector,
    receivePolicyTypeCharacteristic,
} from "@/state/lookups/client";
import { PolicyTypeCharacteristic } from "@/state/lookups/client/policyTypeCharacteristics/types";
import { PolicyType } from "@/state/lookups/client/policyTypes/types";
import { Button, getColumnSearchProps, getTable, Header, PolicyTypeName } from "@/ui/controls";

import EditPolicyTypeCharacteristic from "./EditPolicyTypeCharacteristic";

const Table = getTable<PolicyTypeCharacteristic>();

type Props = PropsFromState & PropsFromDispatch;

const PolicyTypeCharacteristicList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchPolicyTypeCharacteristics();
    }, []);

    const editPolicyTypeCharacteristic = (id: string) => {
        const policyTypeCharacteristic = props.policyTypeCharacteristics.find((u) => u.id === id);
        if (policyTypeCharacteristic) props.editPolicyTypeCharacteristic(policyTypeCharacteristic);
    };

    return (
        <>
            <Header
                iconName="database"
                actions={
                    <Button
                        type="default"
                        iconName="plus"
                        onClick={props.newPolicyTypeCharacteristic}
                        disabled={props.fetching}
                    >
                        New Policy Type Characteristic
                    </Button>
                }
            >
                Policy Type Characteristics
            </Header>
            <Table
                rowKey="id"
                columns={getColumns(props.policyTypes)}
                dataSource={props.policyTypeCharacteristics}
                loading={props.fetching}
                onRowClick={(policyTypeCharacteristic) =>
                    editPolicyTypeCharacteristic(policyTypeCharacteristic.id)
                }
            />
            <EditPolicyTypeCharacteristic onSaved={props.fetchPolicyTypeCharacteristics} />
        </>
    );
};

const getColumns = (policyTypes: PolicyType[]) => {
    const getColumn = getColumnDefinition<PolicyTypeCharacteristic>();
    return [
        getColumn("name", "Name", {}, getColumnSearchProps("Name")),
        getColumn(
            "policyTypeId",
            "Policy Type",
            {},
            {
                render: (policyTypeId: string) => {
                    return <PolicyTypeName policyTypeId={policyTypeId} />;
                },
                filters: policyTypes.map((p) => ({
                    text: p.name,
                    value: p.id,
                })),
            }
        ),
        getColumn("displayOrder", "Order"),
    ];
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyTypeCharacteristicsState = policyTypeCharacteristicsSelector(state);
    return {
        policyTypeCharacteristics: policyTypeCharacteristicsState.items,
        fetching: policyTypeCharacteristicsState.fetching,
        policyTypes: policyTypesSelector(state).items,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchPolicyTypeCharacteristics }, dispatch),
        newPolicyTypeCharacteristic: () => {
            dispatch(newPolicyTypeCharacteristic());
            dispatch(policyTypeCharacteristicVisible(true));
        },
        editPolicyTypeCharacteristic: (policyTypeCharacteristic: PolicyTypeCharacteristic) => {
            dispatch(receivePolicyTypeCharacteristic(policyTypeCharacteristic));
            dispatch(policyTypeCharacteristicVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyTypeCharacteristicList);
