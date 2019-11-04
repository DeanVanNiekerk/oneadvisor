import React, { useState } from "react";
import { connect } from "react-redux";

import { clientPreviewIsLoadingSelector, clientPreviewSelector } from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";
import { Button, Drawer, DrawerFooter, Icon, PreviewCard, PreviewCardRow } from "@/ui/controls";

import PolicyList from "../../../policy/list/PolicyList";

type Props = {
    cardHeight: string;
    onSaved: () => void;
}
    & PropsFromState;

const PoliciesCardComponent: React.FC<Props> = (props: Props) => {

    const [policyListVisible, setPolicyListVisible] = useState<boolean>(false);

    return (
        <>
            <PreviewCard
                title="Policies"
                icon="file-text"
                onClick={() => setPolicyListVisible(true)}
                isLoading={props.loading}
                requiredUseCase="clt_view_policies"
                actions={[<Icon tooltip="View Policies" type="bars" onClick={() => setPolicyListVisible(true)} />]}
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
        loading: clientPreviewIsLoadingSelector(state),
    };
};

const PoliciesCard = connect(mapStateToProps)(PoliciesCardComponent);

export { PoliciesCard };
