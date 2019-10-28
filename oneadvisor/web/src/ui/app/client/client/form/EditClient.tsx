import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { Result } from "@/app/types";
import { areEqual } from "@/app/utils";
import { ValidationResult } from "@/app/validation";
import {
    ClientEdit, clientIsModifyingSelector, clientSelector, confirmCancelClient, insertClient, receiveClient, saveClient,
    updateClient
} from "@/state/app/client/clients";
import { RootState } from "@/state/rootReducer";
import { Button, ClientTypeIcon, ContentLoader, Drawer, DrawerFooter, EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import ClientForm from "./ClientForm";
import EditClientTitle from "./EditClientTitle";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

type State = {
    clientEdited: ClientEdit | null;
};

const EditClient: React.FC<Props> = (props: Props) => {
    return (
        <EditDrawer
            title={<EditClientTitle />}
            icon={<ClientTypeIcon clientTypeId={props.clientTypeId} />}
            visible={props.visible}
            updating={props.loading}
            noTopPadding={true}
            saveRequiredUseCase="clt_edit_clients"
            onClose={props.confirmCancel}
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
        visible: clientIsModifyingSelector(state),
        loading: clientState.updating || clientState.fetching,
        clientTypeId: clientState.client ? clientState.client.clientTypeId : "",
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: () => {
            dispatch(confirmCancelClient(showConfirm));
        },
        saveClient: (onSaved?: () => void) => {
            dispatch(saveClient(onSaved));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditClient);
