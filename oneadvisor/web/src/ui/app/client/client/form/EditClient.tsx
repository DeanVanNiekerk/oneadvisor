import React, { Component, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { clientSelector, clientVisible, confirmCancelClient, saveClient } from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";
import { ClientTypeIcon, EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import ClientForm from "./ClientForm";
import EditClientTitle from "./EditClientTitle";

type Props = {
    onSaved?: () => void;
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
            noTopPadding={true}
            saveRequiredUseCase="clt_edit_clients"
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveClient(props.onSaved);
                close();
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
        loading: clientState.updating || clientState.fetching,
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
        saveClient: (onSaved?: () => void) => {
            dispatch(saveClient(onSaved));
        },
        setVisible: (visible: boolean) => {
            dispatch(clientVisible(visible));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditClient);
