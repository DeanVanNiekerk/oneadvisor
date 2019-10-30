import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { hasUseCase } from "@/app/identity";
import { clientPreviewSelector } from "@/state/app/client/clients";
import { newPolicy, policyVisible, receivePolicy } from "@/state/app/client/policies";
import { useCaseSelector } from "@/state/auth";
import { RootState } from "@/state/rootReducer";
import { Button, Drawer, DrawerFooter, Icon, PreviewCard, PreviewCardRow } from "@/ui/controls";

import PolicyList from "../../../policy/list/PolicyList";

type Props = {
    cardHeight: string;
    onSaved: () => void;
}
    & PropsFromState
    & PropsFromDispatch;

const PoliciesCardComponent: React.FC<Props> = (props: Props) => {

    const [policyListVisible, setPolicyListVisible] = useState<boolean>(false);

    const getPolicyActions = () => {
        const actions = [<Icon tooltip="View Policies" type="bars" onClick={() => setPolicyListVisible(true)} />];

        if (hasUseCase("clt_edit_policies", props.useCases))
            actions.unshift(
                <Icon
                    tooltip="New Policy"
                    type="plus"
                    onClick={e => {
                        e.stopPropagation();
                        if (!props.client) return;
                        props.newPolicy(props.client.id);
                    }}
                />
            );

        return actions;
    };

    return (
        <>
            <PreviewCard
                title="Policies"
                icon="file-text"
                onClick={() => setPolicyListVisible(true)}
                isLoading={props.loading}
                requiredUseCase="clt_view_policies"
                actions={getPolicyActions()}
                height={props.cardHeight}
            >
                {props.client && (
                    <>
                        <PreviewCardRow label="Policies" value={`${props.client.policyCount}`} />
                        <PreviewCardRow label="" value={<span>&nbsp;</span>} />
                    </>
                )}
            </PreviewCard>

            <Drawer
                title="Policies"
                icon="file-text"
                noTopPadding={true}
                visible={policyListVisible}
                onClose={() => setPolicyListVisible(false)}
            >
                {props.client && (
                    <PolicyList clientId={props.client.id} onSaved={props.onSaved} />
                )}
                <DrawerFooter>
                    <Button onClick={() => setPolicyListVisible(false)}>Close</Button>
                </DrawerFooter>
            </Drawer>
        </>

    )
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const clientState = clientPreviewSelector(state);
    return {
        client: clientState.client,
        loading: clientState.fetching || !clientState.client,
        useCases: useCaseSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        newPolicy: (clientId: string) => {
            dispatch(newPolicy({ clientId: clientId }));
            dispatch(policyVisible(true));
        },
    }
}

const PoliciesCard = connect(mapStateToProps, mapDispatchToProps)(PoliciesCardComponent);

export { PoliciesCard };
