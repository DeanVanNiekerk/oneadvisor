import { Tooltip } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";

import { clientPreviewIsLoadingSelector, clientPreviewSelector } from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";
import { Button, Drawer, PreviewCard, PreviewCardRow } from "@/ui/controls";
import { BarsOutlined } from "@ant-design/icons";

import PolicyList from "../../../policy/list/PolicyList";

type Props = {
    cardHeight: string;
    onSaved: () => void;
} & PropsFromState;

const PoliciesCardComponent: React.FC<Props> = (props: Props) => {
    const [policyListVisible, setPolicyListVisible] = useState<boolean>(false);

    return (
        <>
            <PreviewCard
                title="Policies"
                iconName="file-text"
                onClick={() => setPolicyListVisible(true)}
                isLoading={props.loading}
                requiredUseCase="clt_view_policies"
                actions={[
                    <Tooltip key={"1"} title="View Policies" mouseEnterDelay={0.5}>
                        <BarsOutlined onClick={() => setPolicyListVisible(true)} />
                    </Tooltip>,
                ]}
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
                iconName="file-text"
                noTopPadding={true}
                visible={policyListVisible}
                onClose={() => setPolicyListVisible(false)}
                footer={<Button onClick={() => setPolicyListVisible(false)}>Close</Button>}
            >
                {props.client && <PolicyList clientId={props.client.id} onSaved={props.onSaved} />}
            </Drawer>
        </>
    );
};

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
