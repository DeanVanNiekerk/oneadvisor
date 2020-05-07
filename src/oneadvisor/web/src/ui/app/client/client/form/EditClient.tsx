import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "@/state";
import {
    clientIsLoadingSelector,
    clientSelector,
    clientVisible,
    confirmCancelClient,
    saveClient,
} from "@/state/client/clients";
import { ClientEdit } from "@/state/client/clients/types";
import { ClientTypeIcon, EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import ClientForm from "./ClientForm";
import EditClientTitle from "./EditClientTitle";

type Props = {
    onSaved?: (client: ClientEdit) => void;
} & PropsFromState &
    PropsFromDispatch;

const EditClient: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditClientTitle />}
            icon={<ClientTypeIcon clientTypeId={props.clientTypeId} />}
            visible={props.visible}
            updating={props.loading}
            saveRequiredUseCase="clt_edit_clients"
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveClient(props.onSaved);
            }}
        >
            <ClientForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const clientState = clientSelector(state);
    return {
        loading: clientIsLoadingSelector(state),
        visible: clientState.visible,
        clientTypeId: clientState.client ? clientState.client.clientTypeId : "",
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelClient(showConfirm, onCancelled));
        },
        saveClient: (onSaved?: (client: ClientEdit) => void) => {
            dispatch(
                saveClient((clientSaved: ClientEdit) => {
                    if (onSaved) onSaved(clientSaved);
                    dispatch(clientVisible(false));
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(clientVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditClient);
