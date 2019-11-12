import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
    Contact,
    contactIsLoadingSelector,
    contactSelector,
    contactVisible,
    receiveContact,
} from "@/state/app/client/contacts";
import { RootState } from "@/state/rootReducer";
import { Button, ContentLoader, Form, FormField } from "@/ui/controls";

import ContactForm from "./ContactForm";

type Props = {
    clientId: string;
    onSaved?: (contact: Contact) => void;
} & PropsFromState &
    PropsFromDispatch;

const EditContact: React.FC<Props> = (props: Props) => {
    return (
        <ContentLoader isLoading={props.loading}>
            {props.visible && <ContactForm onSaved={props.onSaved} />}
            {!props.visible && (
                <Form className="my-1" layout="inline">
                    <FormField>
                        <Button
                            icon="plus"
                            type="dashed"
                            onClick={() => props.newContact(props.clientId)}
                            noLeftMargin={true}
                            requiredUseCase="clt_edit_contacts"
                        >
                            Add Contact
                        </Button>
                    </FormField>
                </Form>
            )}
        </ContentLoader>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const contactState = contactSelector(state);
    return {
        loading: contactIsLoadingSelector(state),
        visible: contactState.visible,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        newContact: (clientId: string) => {
            dispatch(
                receiveContact({
                    id: "",
                    clientId: clientId,
                    contactTypeId: "",
                    value: "",
                })
            );
            dispatch(contactVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditContact);
