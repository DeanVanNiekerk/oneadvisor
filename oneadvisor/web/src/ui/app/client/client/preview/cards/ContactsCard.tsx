import React, { useState } from "react";
import { connect } from "react-redux";

import { clientPreviewSelector } from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";
import { Button, Drawer, DrawerFooter, Icon, PreviewCard, PreviewCardRow } from "@/ui/controls";

import ContactList from "../../../contact/ContactList";

type Props = {
    cardHeight: string;
    onSaved: () => void;
}
    & PropsFromState;

const ContactsCardComponent: React.FC<Props> = (props: Props) => {

    const [contactListVisible, setContactListVisible] = useState<boolean>(false);

    return (
        <>
            <PreviewCard
                title="Contacts"
                icon="phone"
                onClick={() => setContactListVisible(true)}
                isLoading={props.loading}
                requiredUseCase="clt_view_contacts"
                actions={[<Icon tooltip="View Contacts" type="bars" onClick={() => setContactListVisible(true)} />]}
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
                icon="phone"
                noTopPadding={true}
                visible={contactListVisible}
                onClose={() => setContactListVisible(false)}
            >
                {props.client && (
                    <ContactList clientId={props.client.id} onSave={props.onSaved} />
                )}
                <DrawerFooter>
                    <Button onClick={() => setContactListVisible(false)}>Close</Button>
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
    };
};

const ContactsCard = connect(mapStateToProps)(ContactsCardComponent);

export { ContactsCard };
