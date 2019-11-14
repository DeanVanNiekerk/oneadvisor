import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    confirmCancelOrganisation,
    organisationSelector,
    organisationVisible,
    saveOrganisation,
} from "@/state/app/directory/organisations";
import { fetchUserOrganisation } from "@/state/context/actions";
import { RootState } from "@/state/rootReducer";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditOrganisationTitle from "./EditOrganisationTitle";
import OrganisationForm from "./form/OrganisationForm";

type Props = {
    onSaved?: () => void;
} & PropsFromState &
    PropsFromDispatch;

const EditOrganisation: React.FC<Props> = (props: Props) => {
    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditOrganisationTitle />}
            icon="database"
            visible={props.visible}
            updating={props.updating}
            noTopPadding={true}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveOrganisation(props.onSaved);
            }}
        >
            <OrganisationForm />
        </EditDrawer>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        visible: organisationState.visible,
        updating: organisationState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelOrganisation(showConfirm, onCancelled));
        },
        saveOrganisation: (onSaved?: () => void) => {
            dispatch(
                saveOrganisation(() => {
                    if (onSaved) onSaved();
                    dispatch(organisationVisible(false));
                    dispatch(fetchUserOrganisation());
                })
            );
        },
        setVisible: (visible: boolean) => {
            dispatch(organisationVisible(visible));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganisation);
