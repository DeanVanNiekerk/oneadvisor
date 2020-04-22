import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { Filters, hasFilters } from "@/app/table";
import { RootState } from "@/state";
import {
    fetchPolicies,
    fetchPolicy,
    newPolicy,
    policiesCanMergeSelector,
    policiesSelectedIdsSelector,
    policiesSelector,
    Policy,
    policyMergeVisible,
    policyVisible,
    receiveFilters,
    receiveSelectedPolicies,
} from "@/state/client/policies";
import { Button, Header } from "@/ui/controls";

import EditPolicy from "../form/EditPolicy";
import PolicyMerge from "../merge/PolicyMerge";
import PolicyTable from "./PolicyTable";

type Props = {
    clientId?: string;
    onSaved?: () => void;
    disableRowSelection?: boolean;
} & PropsFromState &
    PropsFromDispatch;

const PolicyList: React.FC<Props> = (props: Props) => {
    const editPolicy = (id: string) => {
        props.editPolicy(id);
    };

    const onSaved = () => {
        props.fetchPolicies(props.clientId);
        if (props.onSaved) props.onSaved();
    };

    const newPolicy = () => {
        props.newPolicy(props.clientId);
    };

    const onRowSelectionChange = (policyIds: string[], policies: Policy[]) => {
        const selectedPolicies = policyIds.map((id) => {
            let policy = policies.filter((p) => !!p).find((p) => p.id === id);
            if (!policy) policy = props.selectedPolicies.find((p) => p.id === id);
            return policy;
        });

        props.updateSelectedPolicies(selectedPolicies.filter((p) => !!p) as Policy[]);
    };

    return (
        <>
            <Header
                className="mb-1"
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
                        <Button
                            danger={true}
                            iconName="delete"
                            onClick={() => props.updateSelectedPolicies([])}
                            visible={props.selectedPolicyIds.length > 0}
                        >
                            Clear Selected Policies
                        </Button>
                        <Button
                            type="primary"
                            iconName="fork"
                            onClick={props.openMergePolicies}
                            visible={props.canMerge}
                            requiredUseCase="clt_edit_policies"
                        >
                            Merge
                        </Button>
                        <Button
                            type="default"
                            iconName="plus"
                            onClick={newPolicy}
                            disabled={props.fetching}
                            requiredUseCase="clt_edit_policies"
                        >
                            New Policy
                        </Button>
                    </>
                }
                iconName={!props.clientId ? "file-text" : undefined}
            >
                {!props.clientId && <span>Policies</span>}
            </Header>
            <PolicyTable
                clientId={props.clientId}
                onPolicyClicked={(policyId) => editPolicy(policyId)}
                rowSelection={
                    !props.disableRowSelection
                        ? {
                              onChange: onRowSelectionChange,
                              selectedRowKeys: props.selectedPolicyIds,
                          }
                        : undefined
                }
            />
            <EditPolicy onSaved={onSaved} />
            <PolicyMerge onMerged={props.fetchPolicies} />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policiesState = policiesSelector(state);
    return {
        fetching: policiesState.fetching,
        filters: policiesState.filters,
        selectedPolicies: policiesState.selectedPolicies,
        selectedPolicyIds: policiesSelectedIdsSelector(state),
        canMerge: policiesCanMergeSelector(state),
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
        updateFilters: (filters: Filters) => {
            dispatch(receiveFilters(filters));
        },
        updateSelectedPolicies: (selectedPolicies: Policy[]) => {
            dispatch(receiveSelectedPolicies(selectedPolicies));
        },
        openMergePolicies: () => {
            dispatch(policyMergeVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyList);
