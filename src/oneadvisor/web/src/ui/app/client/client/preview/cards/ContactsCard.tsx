import { Tooltip } from "antd";
import React, { useState } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { clientPreviewIsLoadingSelector, clientPreviewSelector } from "@/state/client/clients";
import ContactList from "@/ui/app/client/contact/ContactList";
import { Button, Drawer, PreviewCard, PreviewCardRow } from "@/ui/controls";
import { BarsOutlined } from "@ant-design/icons";

type Props = {
    cardHeight: string;
    onSaved: () => void;
} & PropsFromState;

const ContactsCardComponent: React.FC<Props> = (props: Props) => {
    const [contactListVisible, setContactListVisible] = useState<boolean>(false);

    return (
        <>
            <PreviewCard
                title="Contacts"
                iconName="phone"
                onClick={() => setContactListVisible(true)}
                isLoading={props.loading}
                requiredUseCase="clt_view_contacts"
                actions={[
                    <Tooltip key={"1"} title="View Contacts" mouseEnterDelay={0.5}>
                        <BarsOutlined onClick={() => setContactListVisible(true)} />
                    </Tooltip>,
                ]}
                height={props.cardHeight}
            >
                {props.client && (
                    <>
                        <PreviewCardRow label="Contacts" value={`${props.client.contactCount}`} />
                        <PreviewCardRow label="" value={<span>&nbsp;</span>} />
                    </>
                )}
            </PreviewCard>

            <Drawer
                title="Contacts"
                iconName="phone"
                noTopPadding={true}
                visible={contactListVisible}
                onClose={() => setContactListVisible(false)}
                footer={<Button onClick={() => setContactListVisible(false)}>Close</Button>}
            >
                {props.client && <ContactList clientId={props.client.id} onSaved={props.onSaved} />}
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

const ContactsCard = connect(mapStateToProps)(ContactsCardComponent);

export { ContactsCard };
