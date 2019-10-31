import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    companySelector, companyVisible, confirmCancelCompany, saveCompany
} from "@/state/app/directory/lookups/companies";
import { RootState } from "@/state/rootReducer";
import { EditDrawer } from "@/ui/controls";
import { showConfirm } from "@/ui/feedback/modal/confirm";

import EditCompanyTitle from "./EditCompanyTitle";
import CompanyForm from "./form/CompanyForm";

type Props = {
    onSaved?: () => void;
}
    & PropsFromState
    & PropsFromDispatch;

const EditCompany: React.FC<Props> = (props: Props) => {

    const close = () => props.setVisible(false);

    return (
        <EditDrawer
            title={<EditCompanyTitle />}
            icon="database"
            visible={props.visible}
            updating={props.updating}
            noTopPadding={true}
            onClose={() => {
                props.confirmCancel(close);
            }}
            onSave={() => {
                props.saveCompany(props.onSaved);
                close();
            }}
        >
            <CompanyForm />
        </EditDrawer>
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const companyState = companySelector(state);
    return {
        visible: companyState.visible,
        updating: companyState.updating,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        confirmCancel: (onCancelled: () => void) => {
            dispatch(confirmCancelCompany(showConfirm, onCancelled));
        },
        saveCompany: (onSaved?: () => void) => {
            dispatch(saveCompany(onSaved));
        },
        setVisible: (visible: boolean) => {
            dispatch(companyVisible(visible));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCompany);